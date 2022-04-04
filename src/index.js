import {initializeApp} from 'firebase/app'
import {
  getFirestore, collection, onSnapshot, 
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  getAuth,createUserWithEmailAndPassword,
  signOut,signInWithEmailAndPassword,
  onAuthStateChanged

} from 'firebase/auth'



const firebaseConfig = {
  apiKey: "AIzaSyCgtaWIDKQGDGe5Xxe_bO2ckx71P0TfkMc",
  authDomain: "arma-tu-equipo-85761.firebaseapp.com",
  projectId: "arma-tu-equipo-85761",
  storageBucket: "arma-tu-equipo-85761.appspot.com",
  messagingSenderId: "686317921143",
  appId: "1:686317921143:web:a9632850611be3e9a87772"
};

//init firebase app
initializeApp(firebaseConfig)


//init services
const db = getFirestore()
const auth = getAuth()

//collection reference
const collectionRef = collection(db,'books')


//queries: query(referenciaALaColeccion,where('propiedad','coincidencia','palabra clave'),Opcional:orderBy('propiedad',Opcional:'asc o desc'))
//to get All documents delete the where parameter
// const q  = query(collectionRef, where("author","==","BRUNENGO"),orderBy('createdAt'))
//add index in firebase for this to work
const q  = query(collectionRef,orderBy('createdAt'))

//get collection data
// getDocs(collectionRef)
//   .then((snapshot)=>{     
//     let books = []
//     snapshot.docs.forEach((doc)=>{
//       console.log(doc.data())
//       books.push({ id:doc.id,...doc.data()})
//     })
//     console.log('- - - - - - - - - - - - -- - -')
//     console.log(books)
//   })
//   .catch(e=>console.log(e))


//real time collection data 
//on snapshot first parameter: collection reference, document reference or query . Then fires the call back function
//fires the first time and every time there is a change 
const unsubColl = onSnapshot(q,(snapshot)=>{
  let books = []
    snapshot.docs.forEach((doc)=>{
      books.push({ id:doc.id,...doc.data()})
    })
    // console.log(books)
})


// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(collectionRef,{
      title:addBookForm.title.value,
      author:addBookForm.author.value,
      createdAt:serverTimestamp()
    })
      .then(()=>{
        addBookForm.reset()
      })
})


// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const docRef = doc(db,'books',deleteBookForm.id.value)
  deleteDoc(docRef)
    .then(()=>{
      deleteBookForm.reset()
    })

})


//get a sigle document
const docRef = doc(db,'books','Jk48awlqOnfHVn7vAUkJ')

// getDoc(docRef)
//   .then((doc)=>{
//     console.log(doc.data(),doc.id)
//   })

//subscribe to changes to a partcular document. doc is the new version of the document 
const unsubDoc = onSnapshot(docRef,(doc)=>{
  // console.log(doc.data(),doc.id)
})

//update a single doc
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db,'books',updateForm.id.value)
  updateDoc(docRef,{
    author:'Benedetto',

  })
    .then(()=>{
      updateForm.reset()
    })

})


//AUTH
// sign users up


const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  //creates an user and logs in
  createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
      // console.log(userCredential.user)
      signupForm.reset()
    })
    .catch((error)=>console.error(error.message))


})

//log out button
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', (e) => {
  signOut(auth)
    .then(()=>{
      console.log('signed out')
    })
    .catch(error=>{console.log(error.message)})

})


//login
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // console.log('user logged in:', cred.user)
      loginForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

// subscribing to auth changes
//callback fires when there is an authentication change (log in/out)
//user = null if no user logged in
const unsubAuth = onAuthStateChanged(auth,(user)=>{
  console.log('user status changed', user)
})

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing')
  unsubCol()
  unsubDoc()
  unsubAuth()
  
})