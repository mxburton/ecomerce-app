import React from 'react';
import connect from '@vkontakte/vkui-connect'; //@vkontakte/vkui-connect-mock - для отладки
import { View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Items from './panels/Items';
import Item from './panels/Item';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			authToken : null,
			items : [],
			item : null
		};

		this.getItems = this.getItems.bind(this)
		this.getInfoItem = this.getInfoItem.bind(this)
	}

	componentDidMount() {
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppAccessTokenReceived':
					this.setState({ authToken : e.detail.data.access_token });
					break;
				case 'VKWebAppCallAPIMethodResult':
					if (e.detail.data.request_id == 1234567) {
						this.setState({ items : e.detail.data.response })
					}
					if (e.detail.data.request_id == 123) {
						this.setState({ item : e.detail.data.response.items[0] })
					}
					break;
				default:
					console.log(e.detail.type);
			}
		});
		connect.send("VKWebAppGetAuthToken", {"app_id": 6906999, "scope": "market"});
	}

	getItems() {
		const ownerId = -124527492
		connect.send("VKWebAppCallAPIMethod", {"method": "market.get", "params": {"owner_id": ownerId , "v":"5.92", "access_token": this.state.authToken, "request_id" : 1234567 }});
	}

	getInfoItem() {
		const ownerId = -124527492
		let id = this.props.match.params.itemId
		let itemId = `${ownerId}_${id}`
		connect.send("VKWebAppCallAPIMethod", {"method": "market.getById", "params": {"item_ids": itemId , "v":"5.92", "access_token": this.state.authToken, "request_id" : 123 }});
	}

	render() {
		let activePanel = this.props.match.params.activePanel
		return (
			<View activePanel={activePanel}>
				<Items 
					id="items" 
					getItems={() => this.getItems()}
					items={this.state.items}
				/>
				<Item 
					id="item" 
					getInfoItem={() => this.getInfoItem()}
					item={this.state.item}
				/>
			</View>
		);
	}
}

export default App;
