

// actions
const SET_USERS = 'SET_USERS';
const SET_MYFRIENDS = 'SET_MYFRIENDS';
const SET_ME = 'SET_ME'
// const FILTER_USERS = 'FILTER_USERS'

// action-creators
const setUsers = users => ({ type: SET_USERS, users });
const setMyFriends = myFriends => ({ type: SET_MYFRIENDS, myFriends });
const setMe = uid => ({ type: SET_ME, uid });
// const filterUsers = { type: FILTER_USERS }

// reducer
const initialState = {
  users: [], // filtered users
  myFriends: {},
  list: [], 
  sent: [], 
  received: [],
  myFriendsList: {}, // has user objects of friends
  uid: ''
}

const friendObjToArr = (obj, friendsList) => {
  if (typeof obj != 'object') return [];
  return Object.keys(obj).map(uid => friendsList[uid])
}

export const reducer = (state=initialState, action) => {
  const newState = Object.assign({}, state)
  switch (action.type) {
    case (SET_USERS):      
      let newUsers = []
      const users = action.users
      
      // get user objects
      // myFriendsList, users
      for (let uid in users) {
        if (uid == state.uid) continue;
        if (state.myFriendsList[uid])
          newState.myFriendsList[uid] = Object.assign({ uid: uid }, users[uid]);
        else
          newUsers.push( Object.assign(users[uid], { uid: uid }) );
      }
      newState.users = newUsers
      
      // get user objects
      // list/sent/received
      const fList = newState.myFriendsList
      newState.list = friendObjToArr(newState.myFriends.list, fList)
      newState.sent = friendObjToArr(newState.myFriends.sent, fList)
      newState.received = friendObjToArr(newState.myFriends.received, fList)

      break;
    case (SET_MYFRIENDS):
      const myFriends = action.myFriends
      
      // myFriends
      // this line takes null myFriends and makes it {}
      newState.myFriends = Object.assign({}, myFriends) 
      
      // myFriendsList
      let myFriendsList = {}
      for (let key in myFriends) {
        const friends = myFriends[key]
        if (friends) Object.assign(myFriendsList, friends)
      }
      newState.myFriendsList = myFriendsList
      break;
    case (SET_ME):
      newState.uid = action.uid
      break;
    default:
      return state
  }
  return newState
}

// action-dispatcher
// on first run everything must be done before setUsers()

export const setMyFriendsAndUsers = (uid, myFriends, users) => dispatch => {
  dispatch(setMe(uid))
  dispatch(setMyFriends(myFriends))
  dispatch(setUsers(users))
}