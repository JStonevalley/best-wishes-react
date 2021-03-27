import firebase from 'firebase/app'
import 'firebase/firestore'

export const subscribeToOwnDocumentsInCollection = (user) => (collection) => {
  return new Promise((resolve, reject) => {
    firebase
      .firestore()
      .collection(collection)
      .where('ownerUID', '==', user.uid)
      .onSnapshot((querySnapshot) => {
        const data = {}
        querySnapshot.forEach((doc) => {
          data[doc.id] = doc.data()
        })
        resolve(data)
      })
  })
}
