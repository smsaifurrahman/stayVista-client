import PropTypes from 'prop-types'
import { createContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { app } from '../firebase/firebase.config'
import axios from 'axios'
// import useAxiosCommon from '../hooks/useAxioscommon'
export const AuthContext = createContext(null)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  // const axiosCommon = useAxiosCommon();

  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const resetPassword = email => {
    setLoading(true)
    return sendPasswordResetEmail(auth, email)
  }

  const logOut = async () => {
    setLoading(true)
    await axios.get(`${import.meta.env.VITE_API_URL}/logout`, {
      withCredentials: true,
    })
    return signOut(auth)
  }

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    })
  }
  //Get token from server
  const getToken = async email => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/jwt`,
      {email} ,
      { withCredentials: true }
    )
    return data
  }

  const saveUser = async user => {
    const currentUser = {
      email: user?.email,
      role: 'guest',
      status: 'verified'

    }
    const {data} = await axios.put(`${import.meta.env.VITE_API_URL}/user`, currentUser)
    return data;
  }

  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,  currentUser => {
      setUser(currentUser);

      if (currentUser) {
        console.log('from useEffect', currentUser.email);
        getToken(currentUser.email);
         saveUser(currentUser)
      }

          //   if(currentUser) {
    //     // get token and store in client site
    //     console.log('from auth vista', currentUser);
    //     const userInfo = {email: currentUser}
    //     axios.post(
    //           `${import.meta.env.VITE_API_URL}/jwt`,
    //           {userInfo} ,
             
    //         )
    //     .then(res => {
    //         if(res.data.token){
    //             localStorage.setItem('access-token', res.data.token )
    //             console.log('local storage');
    //             saveUser(currentUser);
    //         }
            
    //     })
    // }else {
    //     //todo: remove token(if token is stored in client site)
    //     localStorage.removeItem('access-token')
    // }
      setLoading(false)
    })
    return () => {
      return unsubscribe()
    }
  }, [])

  const authInfo = {
    user,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    resetPassword,
    logOut,
    updateUserProfile,
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  // Array of children.
  children: PropTypes.array,
}

export default AuthProvider
