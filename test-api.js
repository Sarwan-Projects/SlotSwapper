// Quick API test script
// Run with: node test-api.js

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';
let eventId = '';

async function testAPI() {
  console.log('🧪 Testing SlotSwapper API...\n');

  try {
    // Test 1: Signup
    console.log('1️⃣ Testing Signup...');
    const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    token = signupRes.data.token;
    userId = signupRes.data.user.id;
    console.log('✅ Signup successful\n');

    // Test 2: Create Event
    console.log('2️⃣ Testing Create Event...');
    const eventRes = await axios.post(`${BASE_URL}/events`, {
      title: 'Test Meeting',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 90000000).toISOString(),
      status: 'BUSY'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    eventId = eventRes.data._id;
    console.log('✅ Event created successfully\n');

    // Test 3: Get Events
    console.log('3️⃣ Testing Get Events...');
    const eventsRes = await axios.get(`${BASE_URL}/events`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Found ${eventsRes.data.length} event(s)\n`);

    // Test 4: Update Event Status
    console.log('4️⃣ Testing Update Event Status...');
    await axios.put(`${BASE_URL}/events/${eventId}`, {
      status: 'SWAPPABLE'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Event status updated to SWAPPABLE\n');

    // Test 5: Get Swappable Slots
    console.log('5️⃣ Testing Get Swappable Slots...');
    const slotsRes = await axios.get(`${BASE_URL}/swappable-slots`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Found ${slotsRes.data.length} swappable slot(s)\n`);

    // Test 6: Delete Event
    console.log('6️⃣ Testing Delete Event...');
    await axios.delete(`${BASE_URL}/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Event deleted successfully\n');

    console.log('🎉 All tests passed!\n');
    console.log('✨ Your SlotSwapper API is working perfectly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();
