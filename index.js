//window.addEventListener('DOMContentLoaded', async function(event) 
firebase.auth().onAuthStateChanged(async function (user){
    let db = firebase.firestore()
    let apiKey = 'f472f4da092709373e8d8c223e3bb32e'
    let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`)
    let json = await response.json()
    let movies = json.results
    console.log(movies)
  
    if (user) {
  
      let currentUserEmail = firebase.auth().currentUser.email
      let currentUserName = firebase.auth().currentUser.displayName
      let currentUserID = firebase.auth().currentUser.uid
  
      db.collection('users').doc(user.uid).set({
        userID: currentUserID,
        email: currentUserEmail
      })
  
      document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <a href="#" class = "text-white-500">Signed in as ${currentUserName}</a>
      `
      document.querySelector('.sign-in-or-sign-out').innerHTML = `
        <button class="text-pink-500 underline sign-out">Sign Out</button>
      `
      document.querySelector('.sign-in-or-sign-out').addEventListener('click', function(event) {
        console.log('sign out clicked')
        firebase.auth().signOut()
        document.location.href = 'movies.html'
      })
  
  
  
    
    for (let i=0; i<movies.length; i++) {
      let movie = movies[i]
      let docRef = await db.collection('watched').doc(`${movie.id}-${currentUserID}`).get()
      let watchedMovie = docRef.data()
      let opacityClass = ''
  
      if (watchedMovie) {
        opacityClass = 'opacity-20'
      }
  
      document.querySelector('.movies').insertAdjacentHTML('beforeend', `
        <div class="w-1/5 p-4 movie-${movie.id}-${currentUserID} ${opacityClass}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="w-full">
          <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
        </div>
      `)
  
      document.querySelector(`.movie-${movie.id}-${currentUserID}`).addEventListener('click', async function(event) {
        event.preventDefault()
        let movieElement = document.querySelector(`.movie-${movie.id}-${currentUserID}`)
        movieElement.classList.add('opacity-20')
        await db.collection('watched').doc(`${movie.id}-${currentUserID}`).set({})
      }) 
    }} else {
      console.log('signed out')
      let ui = new firebaseui.auth.AuthUI(firebase.auth())
      let authUIConfig = {
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        signInSuccessURL: 'movies.html'
      }
      ui.start('.sign-in-or-sign-out', authUIConfig)
    }
      
  
  
  })