const apiKey = 'AIzaSyA4Fc__QJtCbRAhTi3TnsmHHc1qILeLLpE';
const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test_ai_agent_12345@example.com',
    password: 'TestPassword123!',
    returnSecureToken: true
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
