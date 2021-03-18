firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {

    // Signed in
    console.log('signed in')
    let db = firebase.firestore()
    

    //Create Firebase collection for users
    db.collection('users').doc(user.uid).set({
        name: user.displayName,
        email: user.email
      })

      
//Sign in formatting
document.querySelector('.sign-in-or-sign-out').insertAdjacentHTML('beforeend', `
<h1 class= font-bold> Signed in as ${user.displayName}</h1>
<button class="underline sign-out">Sign Out</button>`)

document.querySelector('.sign-out').addEventListener('click', function(event) {
firebase.auth().signOut()
document.location.href = 'index.html'
})


//Submission link formatting
document.querySelector('.submissionlink').insertAdjacentHTML('beforeend',`
<a href='form.html'>Submit New Review</a>
`)