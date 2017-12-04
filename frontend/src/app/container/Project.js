import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchTweetStats } from '../actions/index';

import { Carousel } from 'react-responsive-carousel';// carousel styles
import { backendUrl } from '../config';

class Project extends Component {
    constructor(props) {
        super(props);
        this.renderPics = this.renderPics.bind(this)
    }

    componentDidMount() {
        this.props.fetchTweetStats();
    }

    renderPics(data) {

        if (typeof data !== 'undefined' && data.length > 0) {
            return (
                <Carousel
                    showArrows={true}
                    useKeyboardArrows
                    showStatus={false}
                    showThumbs={false}
                    dynamicHeight>
                    {data.map(function (singleImg) {
                        return (
                            <div key={singleImg._id}>
                                <img src={backendUrl + singleImg.loc} />
                            </div>
                        );
                    })}
                </Carousel>
            );
        }
    }

    renderParagraph(data) {
        var temp = data.trim();
        return (
            <p>{temp}</p>
        );
    }

    renderParagraphs(data) {
        if (typeof data !== 'undefined') {
            var paragraphs = data.split("<p>");
            return (
                <div id="project-text">
                    {paragraphs.map(this.renderParagraph)}
                </div>
            );
        }
    }

    render() {
        return (
            <div className="container-content-page project-page">
                <h1>{this.props.tweetStats.title}</h1>

                {this.renderPics(this.props.tweetStats.imgs)}

                <h5 className="project-building-type"><b>{this.props.tweetStats.buildingType}</b></h5>
                <hr/>
                <div>
                    {this.renderParagraphs(this.props.tweetStats.content)}
                    <table>
                        <tbody id="project-table">
                            <tr>
                                <th>Works</th>
                                <td>{this.props.tweetStats.works}</td>
                            </tr>
                            <tr>
                                <th>Investor</th>
                                <td>{this.props.tweetStats.investor}</td>
                            </tr>
                            <tr>
                                <th>Year</th>
                                <td>{this.props.tweetStats.year}</td>
                            </tr>
                            <tr>
                                <th>Status </th>
                                <td>{this.props.tweetStats.status}</td>
                            </tr>
                            <tr>
                                <th>TGA</th>
                                <td>{this.props.tweetStats.tga}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        tweetStats: state.tweetStats.stats
    };
}

export default connect(mapStateToProps, {
    fetchTweetStats
})(Project);