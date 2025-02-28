import './RestaurantListing.css';
import { Link } from 'react-router-dom';

/*
The RestaurantListings should have different buttons depending
on if the admin, restaurant manager, and customer is signed in.
As of now, the basic layout is done.

Here is an example of how to use the RestaurantListing component (just for
now, since in the future we should probably have images as props):
return (
    <BrowserRouter>
      <Navbar />
      <h2 className="restaurants-listing-title">All Restaurants</h2>
      <div className="restaurants-listing">
        <RestaurantListing name="In N Out"/>
        <RestaurantListing name="Burger King"/>
        <RestaurantListing name="Palmer's Joint"/>
        <RestaurantListing name="Mario's Place"/>
        <RestaurantListing name="Luigi's Macaroni"/>
        <RestaurantListing name="Laura's Buffet"/>
        <RestaurantListing name="Little Richard's Almanac Deluxe Edition"/>
      </div>
    </BrowserRouter>
)

Also, here's the css for "restaurants-listing-title" and "restaurants-listing"
(so that we have a label like "All Restaurants" or "Pending" or "Your
Restaurants", and so the listing of the restaurants is displayed in rows):
.restaurants-listing-title {
  margin-left: 30px;
  margin-top: 100px;
  color: black;
}

.restaurants-listing {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-left: 30px;
  margin-right: 30px;
}
*/

function RestaurantListing(props) {
    return (
        <div className="thumbnail">
            <Link to='/hi'>
                <div className="image"></div>
            </Link>
            <Link to='/hello'>
                <h3 className="name">{props.name}</h3>
            </Link>
            {/*Admin would see these buttons from restaurants under All Restaurants:*/}
            <button className="thumbnail-btn">Remove</button>
            {/*
            Admin would see these buttons from restaurants under Pending:
            <div className="pair-btns">
                <button className="thumbnail-btn">Approve</button>
                <button className="thumbnail-btn">Deny</button>
            </div>

            Restaurant Manager would see these buttons under the thumbnails:
            <div className="pair-btns">
                <button className="thumbnail-btn">Update</button>
                <button className="thumbnail-btn">Bookings</button>
            </div>

            Customer would see these buttons under the thumbnails:
            <div className="four-btns">
                <button className="smaller-thumbnail-btn">Slot 1</button>
                <button className="smaller-thumbnail-btn">Slot 1</button>
                <button className="smaller-thumbnail-btn">Slot 1</button>
                <button className="smaller-thumbnail-btn">Reserve</button>
            </div>
            */}
        </div>
    )
}

export default RestaurantListing