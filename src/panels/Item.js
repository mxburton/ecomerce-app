import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, FixedLayout, Button, Div, Header, Gallery, Group, HeaderButton } from '@vkontakte/vkui';
import Icon24Back from '@vkontakte/icons/dist/24/back'
import { Link } from "react-router-dom";

class Item extends React.Component {
	constructor(props) {
        super(props);
        
        this.state = {
            slideIndex: 0,
            imageWidth : 150,
            imageHeight : 150
        }
    }
    
    componentWillMount() {
        this.props.getInfoItem()
    }

    componentDidMount() {
        let { item } = this.props

        if (item !== null) {
            this.setState({
                imageHeight : item.photos[0].height * ( item.photos[0].height / window.document.body.offsetHeight )
            })
        }
    }

	render() {
        let { id, item } = this.props

		return (
            <Panel id={id}>
            {
                item !== null &&
                <div>
                    <PanelHeader 
                        left={<Link to="/items"><HeaderButton><Icon24Back/></HeaderButton></Link>}
                    >Товар</PanelHeader>
                    <Header>{item.title} <b>{item.price.text}</b></Header>
                    <Gallery
                        slideWidth="100%"
                        style={{ height: this.state.imageHeight, textAlign : 'center' }}
                        onChange={slideIndex => this.setState({
                            slideIndex : slideIndex,
                            imageHeight : item.photos[slideIndex].height * ( item.photos[slideIndex].height / window.document.body.offsetHeight )
                        })}
                        bullets="dark"
                    >
                        { 
                            item.photos.map((photo, index) => (
                                <div key={index} style={{width: '100%', height : '100%', backgroundColor : '#fff'}}>
                                    <img style={{  
                                        maxHeight : '350px'
                                    }} src={photo.photo_604}></img>
                                </div>
                            ))
                        }
                    </Gallery>
                    <Group>
                        <Div>
                            {item.description}
                        </Div>
                    </Group>
                    <FixedLayout vertical="bottom">
                        <Div>
                            <Button size="xl" level="commerce">Купить</Button>
                        </Div>
                    </FixedLayout>
                </div>
            }
            {
                item == null &&
                <div>
                    <PanelHeader 
                        left={<Link style={{ textDecoration : 'none', color: '#fff'}} to="/items"><HeaderButton><Icon24Back/></HeaderButton></Link>}
                    >Товар</PanelHeader>
                    <Group>
                        <Div>
                            Хм, но мы не нашли товар.
                        </Div>
                    </Group>
                </div>
            }
            </Panel>
		);
	}
}

Item.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Item;
