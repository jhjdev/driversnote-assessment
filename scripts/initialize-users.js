const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_BASE_URL || 'https://driversnote-assessment-api.onrender.com/api';
const API_KEY = process.env.API_KEY || 'your-api-key-here';

if (!process.env.API_KEY) {
  console.error('❌ API_KEY environment variable is required');
  console.error('Please set API_KEY in your environment or .env file');
  process.exit(1);
}

async function initializeUsers() {
  try {
    console.log('🚀 Initializing MongoDB with complete user data...\n');

    // Read users data from JSON file
    const usersJsonPath = path.join(__dirname, '..', 'app', 'data', 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersJsonPath, 'utf8'));

    console.log(`📋 Found ${usersData.length} users in users.json`);

    // First, let's check what's currently in the database
    console.log('\n1. Checking current users in MongoDB...');
    const currentUsersResponse = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'X-API-Key': API_KEY,
      },
    });
    const currentUsers = await currentUsersResponse.json();
    console.log(`📊 Currently ${currentUsers.length} users in MongoDB:`);
    currentUsers.forEach(user => {
      console.log(`   - ${user.full_name} (ID: ${user.id})`);
    });

    // For each user in users.json, check if it exists and update/create as needed
    console.log('\n2. Updating users with complete data...');

    for (const userData of usersData) {
      const existingUser = currentUsers.find(u => u.id === userData.id);

      if (existingUser) {
        // Update existing user with complete data
        console.log(`📝 Updating user ${userData.id}: ${userData.full_name}`);

        const updateResponse = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
          },
          body: JSON.stringify({
            full_name: userData.full_name,
            tag: userData.tag || '',
            address1: userData.address1,
            address2: userData.address2,
            postal_code: userData.postal_code,
            city: userData.city,
            country_name: userData.country_name,
            country_id: userData.country_id,
            organisation_id: userData.organisation_id,
          }),
        });

        if (updateResponse.ok) {
          const updatedUser = await updateResponse.json();
          console.log('   ✅ Updated successfully');
        } else {
          console.log(`   ❌ Failed to update: ${updateResponse.status}`);
          const error = await updateResponse.text();
          console.log(`   Error: ${error}`);
        }
      } else {
        // Create new user
        console.log(`➕ Creating new user ${userData.id}: ${userData.full_name}`);

        const createResponse = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
          },
          body: JSON.stringify({
            full_name: userData.full_name,
            tag: userData.tag || '',
            address1: userData.address1,
            address2: userData.address2,
            postal_code: userData.postal_code,
            city: userData.city,
            country_name: userData.country_name,
            country_id: userData.country_id,
            organisation_id: userData.organisation_id,
          }),
        });

        if (createResponse.ok) {
          const newUser = await createResponse.json();
          console.log(`   ✅ Created successfully with ID: ${newUser.id}`);
        } else {
          console.log(`   ❌ Failed to create: ${createResponse.status}`);
          const error = await createResponse.text();
          console.log(`   Error: ${error}`);
        }
      }
    }

    // Verify the final state
    console.log('\n3. Verifying final state...');
    const finalUsersResponse = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'X-API-Key': API_KEY,
      },
    });
    const finalUsers = await finalUsersResponse.json();

    console.log('\n🎉 Initialization completed!');
    console.log(`📊 Final state: ${finalUsers.length} users in MongoDB`);

    // Show a sample user to verify the data structure
    if (finalUsers.length > 0) {
      const sampleUser = finalUsers[0];
      console.log('\n📋 Sample user data:');
      console.log(JSON.stringify(sampleUser, null, 2));
    }
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
  }
}

// Check if node-fetch is available, otherwise provide instructions
try {
  initializeUsers();
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('❌ node-fetch is required to run this script.');
    console.log('Please install it with: npm install node-fetch');
    console.log('Or run the curl commands manually from the console.');
  } else {
    throw error;
  }
}
