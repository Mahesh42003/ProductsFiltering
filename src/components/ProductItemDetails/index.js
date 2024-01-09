import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    newItem: {},
    similarityProducts: [],
    count: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProduct()
  }

  getProduct = async () => {
    const {apiStatus} = this.state
    const {match} = this.props
    const {params} = match
    const {id} = params
    const value = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${value}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const singleItem = {
        title: fetchedData.title,
        imageUrl: fetchedData.image_url,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        price: fetchedData.price,
        description: fetchedData.description,
      }
      console.log(fetchedData.similar_products)
      const similarity = fetchedData.similar_products.map(each => ({
        title: each.title,
        imageUrl: each.image_url,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
        price: each.price,
        description: each.description,
        id: each.id,
      }))
      this.setState({
        newItem: singleItem,
        similarityProducts: similarity,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDecrement = () => {
    const {count} = this.state
    if (count > 0) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    } else if (count < 0) {
      this.setState({count: 0})
    }
  }

  onIncrement = () => {
    const {count} = this.state
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderedProduct = () => {
    const {newItem, count} = this.state

    const {
      title,
      imageUrl,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = newItem

    return (
      <div>
        <img src={imageUrl} className="line-height" alt="product" />
        <div>
          <h1>{title}</h1>
          <p>Rs {price}/-</p>
          <p>
            {rating}
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
            />
          </p>
          <p>{totalReviews} Reviews</p>
          <p>{description}</p>
          <p>Available: {availability}</p>
          <p>Brand: {brand}</p>

          <hr />
          <button onClick={this.onDecrement} data-testid="minus" alt="minus">
            <BsDashSquare />
          </button>
          <p>{count}</p>
          <button onClick={this.onIncrement} data-testid="plus" alt="plus">
            <BsPlusSquare />
          </button>
          <button>ADD TO CART</button>
        </div>
      </div>
    )
  }

  continueClicking = () => {
    const {history} = this.props
    history.replace('/products')
  }

  switchCase = () => {
    const {newItem, similarityProducts, apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <div>
            <Header />
            {this.renderedProduct()}
            <ul>
              {similarityProducts.map(each => (
                <SimilarProductItem similarityProducts={each} key={each.id} />
              ))}
            </ul>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div>
            <Header />
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
              alt="failure view"
            />
            <h1>Product Not Found</h1>
            <button onClick={this.continueClicking}>Continue Shopping</button>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const {newItem, similarityProducts} = this.state
    console.log(newItem)
    return this.switchCase()
  }
}
export default ProductItemDetails
