import React, { Component } from 'react';

var $ = require ('jquery');

class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollTop: 0
        };
    }



    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        if ($ !== 'undefined') {
            $('body,html').scrollTop(0, 800);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        this.state = {
            scrollTop: ($(window).scrollTop())
        };
    }

    scrollToTop() {
        $('body,html').animate({scrollTop: 0}, 800);
    }



    render() {
        if (this.state.scrollTop < this.props.offset) {
            return null;
        }

        return (
            <div>
                <div id="footer-white-background">
                    <div id="back-to-top-btn" onClick={this.scrollToTop}><span></span>Back to top</div>
                </div>

                <footer>
                    <div id="pre-footer">
                        <div className="container-footer">
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 side-pad top-pad">
                                    <h2 id="footer-header"><div id="toskov">VERIFIED</div> &nbsp; <div id="architects"> LOCATIONS</div></h2>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 top-pad">
                                    <div id="footer-text">
                                        <p>
                                            The goal of this project is to showcase the uses of the
                                            blockchain technology in the car sharing industry. This website simulates
                                            the whole system from the perspective of each participant in the smart contract -
                                            the owner, the retner and the oracle. The renter can rent and return a car.
                                            The owner can create and delete car as well as withdraw his earnings collected
                                            from penalties from renters who left the geo-fence. The oracle can see all rented
                                            cars and is able to set their position on the map.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="container-footer" id="rights-and-credits">
                        <div className="row">
                            <div
                                className="col-lg-6 col-md-6 col-sm-6 col-xs-12"
                                id="footer-about">
                                <div>
                                    &copy; All rights reserved 2018.
                                </div>
                            </div>
                            <div
                                className="col-lg-6 col-md-6 col-sm-6 col-xs-12"
                                id="footer-contact">
                                <div className="pull-right">
                                    Developed by
                                    Daniel Dimitrov
                                    , Har Preet Singh
                                    , Piyasa Basak
                                    , Radoslav Vlaskovski
                                    , Sebastian Zickau
                                    , Victor Friedhelm
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Footer;
