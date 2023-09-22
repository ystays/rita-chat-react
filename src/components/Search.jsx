import React from 'react'

const Search = () => {
    return ( 
        <div className='search'>
            <div className='searchForm'>
                <input type='text' placeholder='Find a user'/>
            </div>
            <div className='userChat'>
                <img src='https://media.gettyimages.com/id/1314490189/photo/confident-hispanic-businesswoman-against-white-background.jpg?s=1024x1024&w=gi&k=20&c=RKNrZAS2GVxzkj9-E6Pl-w1kh6ItZwgfjGZgCQLD5-U=' />
                <div className='userChatInfo'>
                    <span>K</span>
                </div>
            </div>
        </div>

    )
}

export default Search