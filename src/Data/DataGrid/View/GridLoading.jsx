import React from "react"

const LoadingView = function (props) {
   return  <React.Fragment>
        <div
            className='wasabi-grid-loading'
            key="wasabi-grid-loading-div"
            style={{ display: 'block' }}
        ></div><div
            key="wasabi-grid-loading-icon"
            className='wasabi-load-icon'
            style={{ display: 'block' }}
        ></div>
    </React.Fragment>
}
export default React.memo(LoadingView);