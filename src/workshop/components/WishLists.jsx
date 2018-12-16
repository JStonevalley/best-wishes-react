import React from 'react'
import { compose, lifecycle } from 'recompose'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import IconButton from '@material-ui/core/IconButton'
import ReceiptIcon from '@material-ui/icons/Receipt'
import AddIcon from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'
import { Form, Field } from 'react-final-form'
import { RegularTextField } from '../../shared/FormFields'
import { getPersonalWishLists, setActiveList, createWishList } from '../actions'
import { required } from '../../shared/FormValidators'

export const WishLists = compose(
  connect((state) => ({
    wishLists: state.wishLists.lists
  })),
  lifecycle({
    componentDidMount () {
      this.props.dispatch(getPersonalWishLists())
    }
  })
)(({ dispatch, wishLists, style }) => {
  return <Card style={{ margin: '1rem', ...style }}>
    <CardContent>
      <Typography
        variant='headline'
        component='h2'
      >
        My Wish Lists
      </Typography>
      <List>
        {wishLists.map((wishList, key) => <ListItem
          key={key}
          button
          onClick={() => dispatch(setActiveList(key))}
        >
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary={wishList.get('title')} />
        </ListItem>).toList()}
        <NewWishListForm />
      </List>
    </CardContent>
  </Card>
})

const NewWishListForm = connect()(({ dispatch }) => {
  return <Form
    onSubmit={(data) => dispatch(createWishList(data))}
    render={({ handleSubmit }) => {
      return <ListItem>
        <Field
          name='title'
          component={RegularTextField}
          label='Title'
          validate={required}
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={handleSubmit}
          >
            <AddIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    }}
  />
})
