import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, category, details, month, link, organizationName } = req.body;

    // Validate required fields
    if (!name || !category || !details || !month || !link || !organizationName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Read current database
    const dbPath = path.join(process.cwd(), 'database.json');
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    const database = JSON.parse(dbContent);

    // Determine which category array to add to
    const categoryMap = {
      'Funding': 'funding',
      'Education': 'education',
      'Expats': 'expats',
      'Founders': 'founders',
      'Study': 'study',
      'Social': 'social'
    };

    const dbCategory = categoryMap[category];
    if (!dbCategory) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Generate new ID
    const existingIds = database.hong_kong_ecosystem[dbCategory].map(item => item.id);
    const maxId = existingIds.length > 0 
      ? Math.max(...existingIds.map(id => parseInt(id.substring(1)) || 0))
      : 0;
    const newId = `${dbCategory.charAt(0)}${maxId + 1}`;

    // Create new entry
    const newEntry = {
      id: newId,
      name,
      category,
      details,
      month,
      link,
      _submittedBy: organizationName,
      _submittedAt: new Date().toISOString()
    };

    // Add to database
    database.hong_kong_ecosystem[dbCategory].push(newEntry);

    // Write back to file
    fs.writeFileSync(dbPath, JSON.stringify(database, null, 2), 'utf8');

    return res.status(200).json({ 
      success: true, 
      message: 'Opportunity added successfully',
      entry: newEntry
    });

  } catch (error) {
    console.error('Error adding opportunity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
