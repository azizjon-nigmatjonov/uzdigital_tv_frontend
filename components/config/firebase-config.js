// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyDIrS8PLk5glR3WaLwamvs0FiaGPcomlww',
    authDomain: 'uz-digital.firebaseapp.com',
    projectId: 'uz-digital',
    storageBucket: 'uz-digital.appspot.com',
    messagingSenderId: '144424127206',
    appId: '1:144424127206:web:9839be21cbe8d83b924927',
    measurementId: 'G-WKCD06D8RY',
}

const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
export const authorization = getAuth(app)
