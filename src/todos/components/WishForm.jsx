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
    render={({handleSubmit, values: {image, link}, form}) => {
      const setDataFetchedFromUrl = ({title, image, body}) => {
        form.batch(() => {
          title && form.change('title', title)
          image && form.change('image', image)
          body && form.change('body', body)
        })
      }
      return <form
        onSubmit={handleSubmit}
        className={classes.container}
      >
        <div className={classes.imageContainer}>
          {image && <img src={image} className={classes.image} alt='wish' />}
        </div>
        <div className={classes.outerFieldsContainer}>
        <LinkSection link={link} onMetadataFetched={setDataFetchedFromUrl} />
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
)(({link, classes, onMetadataFetched}) => {
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
      onClick={async () => {
        const metadata = await fetchProductInfo(link)
        onMetadataFetched(metadata)
      }}
    >
      Fetch info
    </Button>
  </div>
})

const fetchProductInfo = async (url) => {
  const metadata = await (await fetch(
    `${process.env.REACT_APP_API_BASE_URL}/fetch-page-meta`,
    {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url})
    }
  )).json()
  return {
    title: metadata.title,
    image: metadata.image,
    body: metadata.description
  }
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

