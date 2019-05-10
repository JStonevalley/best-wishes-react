import { fromJS } from 'immutable'
import { bwFetch } from '../shared/actions'

export const WISH_LIST_SHARE_FETCHED = 'WISH_LIST_SHARE_FETCHED'

export const fetchWishListShare = id => {
  return async dispatch => {
    try {
      const { shares, wishList, wishes, givers } = await bwFetch(
        `share/${id}`,
        {
          method: 'GET'
        }
      )
      dispatch({
        type: WISH_LIST_SHARE_FETCHED,
        shares: fromJS(shares),
        wishList: fromJS(wishList),
        wishes: fromJS(wishes),
        givers: fromJS(givers)
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export const GRANT_WISH = 'GRANT_WISH'

export const grantWish = ({ wishId, shareId }) => {
  return async dispatch => {
    try {
      const share = await bwFetch(`share/wish/grant`, {
        method: 'PUT',
        body: JSON.stringify({ wishId, shareId })
      })
      dispatch({
        type: GRANT_WISH,
        share: fromJS(share)
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export const REVOKE_WISH = 'GRANT_WISH'

export const revokeWish = ({ wishId, shareId }) => {
  return async dispatch => {
    try {
      const share = await bwFetch(`share/wish/revoke`, {
        method: 'PUT',
        body: JSON.stringify({ wishId, shareId })
      })
      dispatch({
        type: REVOKE_WISH,
        share: fromJS(share)
      })
    } catch (error) {
      console.error(error)
    }
  }
}
