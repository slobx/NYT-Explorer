import React, {Component} from 'react';
import $ from 'jquery';

class ArticleGrid extends React.Component {

    render() {
        let images = this.props.images;
        let titles = this.props.titles;
        let descriptions = this.props.descriptions;

        return (
            <div className="wrapper">
                <div className="flex-grid">
                    {
                        titles.map((title, i) => {
                            return (<ArticlePreview isClicked={i === this.props.clicked_index}
                                                    onClick={(evt) => this.props.clicked(evt, i)}
                                                    img={images[i]}
                                                    title={titles[i]}
                                                    description={descriptions[i]}
                                                    key={i}> </ArticlePreview>)
                        })
                    }
                </div>
            </div>
        )
    }
}

const ArticlePreview = (props) => {
    return (
        <div className={`col ${props.isClicked ? 'red' : 'white'}`} onClick={props.onClick}>
            <p className="title_p">{props.title}</p>
            <img src={props.img}/>
            <p className="text_p">{props.description ? props.description.substring(0, 75) + "..." : props.description}</p>
        </div>
    )
};

const ArticleDetails = (props) => {
    return (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <span className="close">&times;</span>
                    <p>{props.headline}</p>
                </div>
                <div className="modal-body">
                    <p>Section: {props.section}</p>
                    <p>Word count: {props.word_count}</p>
                    <p>Author: {props.author}</p>
                    <p>Publication date: {props.pub_date}</p>
                    <button className="read_more_btn"><a target="_blank" href={props.web_url}>Read more</a></button>
                </div>

            </div>

        </div>
    );

};

export default ArticleGrid;
export {ArticlePreview};
export {ArticleDetails};

