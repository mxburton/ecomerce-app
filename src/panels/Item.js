import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, FixedLayout, Button, Div, Header, Gallery, Group, HeaderButton } from '@vkontakte/vkui';
import Icon24Back from '@vkontakte/icons/dist/24/back'

class Item extends React.Component {
	constructor(props) {
        super(props);
        
        this.state = {
            slideIndex: 0,
            imageHeight : 350
        }
    }
    
	render() {
        let { id, item } = this.props

		return (
            <Panel id={id} style={{ marginBottom : 100 }}>
            {
                item !== null &&
                <div>
                    <PanelHeader 
                        left={<HeaderButton data-to="items" onClick={(e) => this.props.go(e)}><Icon24Back/></HeaderButton>}
                    >Товар</PanelHeader>
                    <Header>{item.title} <b>{item.price.text}</b></Header>
                    { 
                        item.photos.length > 0 && 
                        (
                            <Gallery
                                slideWidth="100%"
                                style={{ height: this.state.imageHeight, textAlign : 'center' }}
                                bullets="dark"
                            >
                                { 
                                    item.photos.map((photo, index) => (
                                        <div key={index} style={{width: '100%', height : '100%', backgroundColor : '#fff'}}>
                                            <img 
                                                alt=""
                                                style={{  
                                                    maxHeight : this.state.imageHeight
                                                }} src={photo.sizes[photo.sizes.length - 1].url}>
                                            </img>
                                        </div>
                                    ))
                                }
                            </Gallery>
                        )
                    }
                    {
                        item.photos.length === 0 &&
                        (
                            <Gallery
                                slideWidth="100%"
                                style={{ height: this.state.imageHeight, textAlign : 'center' }}
                            >
                                <div style={{width: '100%', height : '100%', backgroundColor : '#fff'}}>
                                    <img 
                                        alt=""
                                        style={{  
                                            maxHeight : '350px'
                                        }} src={item.thumb_photo}></img>
                                </div>
                            </Gallery>
                        )
                    }
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
                        left={<HeaderButton data-to="items" onClick={(e) => this.props.go(e)}><Icon24Back/></HeaderButton>}
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
