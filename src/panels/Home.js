import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Cell, List, PanelHeader, Group, Div } from '@vkontakte/vkui';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [
				{
				   "id":250409,
				   "owner_id":-124527492,
				   "title":"Persik",
				   "description":"A majestic furball who adores to sleep, to purr, and to play with a computer mouse.",
				   "price":{
					  "amount":"100000",
					  "currency":{
						 "id":643,
						 "name":"RUB"
					  },
					  "text":"1,000 rub."
				   },
				   "category":{
					  "id":1001,
					  "name":"Cats",
					  "section":{
						 "id":10,
						 "name":"Pets"
					  }
				   },
				   "date":1467722904,
				   "thumb_photo":"https://pp.vk.me/c631229/v631229852/3b6f3/SQ607FYCmy4.jpg",
				   "availability":0
				},
				{
				   "id":250407,
				   "owner_id":-124527492,
				   "title":"Spotty",
				   "description":"A tail wagging champion, true friend and never-failing warmer.",
				   "price":{
					  "amount":"100000",
					  "currency":{
						 "id":643,
						 "name":"RUB"
					  },
					  "text":"1,000 rub."
				   },
				   "category":{
					  "id":1000,
					  "name":"Dogs",
					  "section":{
						 "id":10,
						 "name":"Pets"
					  }
				   },
				   "date":1467722851,
				   "thumb_photo":"https://pp.vk.me/c631229/v631229852/3b6e5/1OWGz65-8vw.jpg",
				   "availability":0
				},
				{
				   "id":250396,
				   "owner_id":-124527492,
				   "title":"First market item",
				   "description":"Description text",
				   "price":{
					  "amount":"10000",
					  "currency":{
						 "id":643,
						 "name":"RUB"
					  },
					  "text":"100 rub."
				   },
				   "category":{
					  "id":1,
					  "name":"Women's Clothing",
					  "section":{
						 "id":0,
						 "name":"Fashion"
					  }
				   },
				   "date":1467721947,
				   "thumb_photo":"https://pp.vk.me/c633819/v633819852/37ae0/7lXUEbCwYYM.jpg",
				   "availability":0
				}
			 ]
		};

		this.getItems = this.getItems.bind(this)
	}

	getItems() {
		const ownerId = 124527492
		let api = `https://api.vk.com/method/market.get?v=5.52&access_token=${this.props.authToken}&owner_id=-${ownerId}`
		return fetch(api)
		.then(res => res.json())
		.then(data => data.response.item)
		.catch(e => [])
	}

	componentDidMount() {
		this.getItems()
		.then(items => this.setState({ items }))
	}

	render() {

		let { id } = this.props

		return (
			<Panel id={id}>
				<PanelHeader>Товары</PanelHeader>
				<Group>
					<List>
						{
							this.state.items.length > 0 && this.state.items.map((item, index) => (
								<Cell 
									key={index}
									before={
										<img 
											style={{ 
												width: 40, 
												height : 40, 
												margin : 10 
											}} 
											src={item.thumb_photo}
										/>
									}
									multiline
									description={item.description}
								>
								{item.title}, {item.price.amount} {item.price.currency.name}
								</Cell>
							))
						}
						{
							this.state.items.length == 0 &&
							<Div>
								Хм, но мы не нашли товаров.
							</Div>
						}
					</List>
				</Group>
			</Panel>
		);
	}
}

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
