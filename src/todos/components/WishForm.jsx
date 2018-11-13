import * as React from 'react'
import {Form, Field} from 'react-final-form'
import {RegularTextField} from '../../shared/FormFields'
import {saveWish} from '../actions'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {withStyles} from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import blue from '@material-ui/core/colors/blue'
import {getMetadata} from 'page-metadata-parser'
import {JSDOM} from 'jsdom'

const mapDispatchToProps = {
  saveWish
}

const styles = {
  image: {
    width: '10vw',
    height: '10vw',
    objectFit: 'cover',
    borderRadius: '5vw'
  },
  imageContainer: {
    alignSelf: 'center',
    width: '10vw',
    height: '10vw'
  },
  container: {
    display: 'flex'
  },
  outerFieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  divider: {
    margin: '2vw'
  }
}

export const WishForm = compose(
  connect(null, mapDispatchToProps),
  withStyles(styles)
)(({wish, saveWish, classes}) => {
  return <Form
    onSubmit={saveWish}
    initialValues={wish}
    render={({handleSubmit, values: {image, link}}) => {
      return <form
        onSubmit={handleSubmit}
        className={classes.container}
      >
        <div className={classes.imageContainer}>
          {image && <img src={image} className={classes.image} alt='wish' />}
        </div>
        <div className={classes.outerFieldsContainer}>
        <LinkSection link={link} />
        <Divider className={classes.divider} />
        <div className={classes.container}>
            <Field
              name='id'
              component={() => null}
            />
            <TextSection />
            <MiscSection />
          </div>
        </div>
      </form>
    }}
  />
})

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
  withStyles(linkSectionStyle)
)(({link, classes}) => {
  return <div className={classes.wrapper}>
    <Field
      name="link"
      component={RegularTextField}
      label="Link"
      className={classes.input}
      inputClassName={classes.linkInput}
    />
    <Button
      variant='text'
      color='primary'
      className={classes.button}
      onClick={() => fetchProductInfo(link)}
    >
      Fetch info
    </Button>
  </div>
})

const fetchProductInfo = async (url) => {
  const response = await fetch(url, {method: 'GET', mode: 'no-cors'})
  const html = await response.text()
  console.log(html)
  const doc = new JSDOM(html)
  const {title, description, image} = getMetadata(doc, url)
  console.log({title, body: description, image})
  return {title, body: description, image}
}

const sectionStyle = (theme) => ({
  wrapper: {
    margin: `0 ${3 * theme.spacing.unit}px`,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  input: {
    width: '100%'
  },
  linkInput: {
    color: blue[500]
  }
})

const TextSection = withStyles(sectionStyle)(({classes}) => {
  return <div
    className={classes.wrapper}
  >
    <Field
      name="title"
      component={RegularTextField}
      label="Title"
      className={classes.input}
    />
    <Field
      name="body"
      component={RegularTextField}
      multiline
      label="Body"
      className={classes.input}
    />
  </div>
})

const MiscSection = withStyles(sectionStyle)(({classes}) => {
  return <div
    className={classes.wrapper}
  >
    <Field
      name="price"
      component={RegularTextField}
      type='number'
      label="Price"
      className={classes.input}
    />
    <Field
      name="image"
      component={RegularTextField}
      label="Image"
      className={classes.input}
      inputClassName={classes.linkInput}
    />
  </div>
})

