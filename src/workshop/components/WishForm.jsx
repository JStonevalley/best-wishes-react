/* global fetch */
import * as React from 'react'
import { Form, Field } from 'react-final-form'
import { RegularTextField } from '../../shared/FormFields'
import { required } from '../../shared/FormValidators'
import { saveWish } from '../actions'
import { connect } from 'react-redux'
import { compose, withState } from 'recompose'
import { Map } from 'immutable'
import { withStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import blue from '@material-ui/core/colors/blue'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

const mapDispatchToProps = {
  saveWish
}

const styles = {
  image: {
    width: '100%',
    objectFit: 'contain',
    borderRadius: '10px'
  },
  imageContainer: {
    alignSelf: 'center',
    width: '15rem'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  contentContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  outerFieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  divider: {
    margin: '2vw'
  },
  submitButtonIcon: {
    marginRight: '1rem'
  }
}

export const WishForm = compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withState('fetchingInfo', 'setFetchingInfo'),
  withStyles(styles)
)(
  ({
    wish,
    wishListId,
    saveWish,
    fetchingInfo,
    setFetchingInfo,
    classes,
    history,
    match: { url }
  }) => {
    wish = wish || Map({ id: null, wishList: wishListId })
    const closeDialog = () => {
      const urlSegments = url.split('/')
      const newUrl = urlSegments.slice(0, urlSegments.length - 1).join('/')
      history.push(newUrl)
    }
    return (
      <Form
        onSubmit={wish => saveWish(wish).then(closeDialog)}
        initialValues={wish.toJS()}
        render={({ handleSubmit, values: { image, link }, form }) => {
          const setDataFetchedFromUrl = ({ title, image, body }) => {
            form.batch(() => {
              title && form.change('title', title)
              image && form.change('image', image)
              body && form.change('body', body)
            })
            setFetchingInfo(false)
          }
          return (
            <form onSubmit={handleSubmit} className={classes.flexColumn}>
              <Dialog open>
                <DialogContent>
                  <div className={classes.contentContainer}>
                    {image && (
                      <div className={classes.imageContainer}>
                        <img src={image} className={classes.image} alt='wish' />
                      </div>
                    )}
                    <div className={classes.outerFieldsContainer}>
                      <LinkSection
                        link={link}
                        onMetadataFetchingStarted={() => setFetchingInfo(true)}
                        onMetadataFetched={setDataFetchedFromUrl}
                      />
                      <Divider className={classes.divider} />
                      <div className={classes.contentContainer}>
                        <Field name='id' component={() => null} />
                        <Field name='wishList' component={() => null} />
                        <TextSection disabled={fetchingInfo} />
                        <MiscSection disabled={fetchingInfo} />
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant='text'
                    color='secondary'
                    onClick={closeDialog}
                    tyle='button'
                  >
                    Cancel
                  </Button>
                  <Button variant='text' color='primary' onClick={form.submit}>
                    <SaveIcon className={classes.submitButtonIcon} />
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
          )
        }}
      />
    )
  }
)

const linkSectionStyle = {
  wrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    flexGrow: 1,
    margin: '0 2vw'
  },
  button: {
    margin: '0 2vw'
  },
  linkInput: {
    color: blue[500]
  }
}

const LinkSection = compose(
  withStyles(linkSectionStyle),
  withState('fetchingInfo', 'setFetchingInfo')
)(
  ({
    link,
    classes,
    fetchingInfo,
    setFetchingInfo,
    onMetadataFetchingStarted,
    onMetadataFetched
  }) => {
    return (
      <div className={classes.wrapper}>
        <Field
          name='link'
          component={RegularTextField}
          label='Link'
          className={classes.input}
          inputClassName={classes.linkInput}
          disabled={fetchingInfo}
        />
        <Button
          variant='text'
          color='primary'
          disabled={fetchingInfo}
          className={classes.button}
          onClick={async () => {
            setFetchingInfo(true)
            onMetadataFetchingStarted()
            const metadata = await fetchProductInfo(link)
            onMetadataFetched(metadata)
            setFetchingInfo(false)
          }}
        >
          Fetch info
        </Button>
      </div>
    )
  }
)

const fetchProductInfo = async url => {
  const metadata = await (await fetch(
    `${process.env.REACT_APP_API_BASE_URL}/fetch-page-meta`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    }
  )).json()
  return {
    title: metadata.title,
    image: metadata.image,
    body: metadata.description
  }
}

const sectionStyle = theme => ({
  wrapper: {
    margin: `0 ${3 * theme.spacing.unit}px`,
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 15rem'
  },
  input: {
    width: '100%'
  },
  linkInput: {
    color: blue[500]
  }
})

const TextSection = withStyles(sectionStyle)(({ disabled, classes }) => {
  return (
    <div className={classes.wrapper}>
      <Field
        name='title'
        component={RegularTextField}
        label='Title'
        validate={required}
        disabled={disabled}
        className={classes.input}
      />
      <Field
        name='body'
        component={RegularTextField}
        multiline
        label='Body'
        disabled={disabled}
        className={classes.input}
      />
    </div>
  )
})

const MiscSection = withStyles(sectionStyle)(({ disabled, classes }) => {
  return (
    <div className={classes.wrapper}>
      <Field
        name='price'
        component={RegularTextField}
        type='number'
        label='Price'
        disabled={disabled}
        className={classes.input}
      />
      <Field
        name='image'
        component={RegularTextField}
        label='Image'
        disabled={disabled}
        className={classes.input}
        inputClassName={classes.linkInput}
      />
    </div>
  )
})
