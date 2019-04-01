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
			activePanel : 'items',
			authToken : null,
			items : [],
			item : null
		};
	}

	getLocationHash() {
		return window.location.hash.replace('#','')
	}

	componentWillMount() {
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppAccessTokenReceived':
					this.setState({ authToken : e.detail.data.access_token });
					break;
				case 'VKWebAppCallAPIMethodResult':
					if (e.detail.data.request_id === 1234567) {
						this.setState({ items : e.detail.data.response.items })
					}
					if (e.detail.data.request_id === 123) {
						this.setState({ item : e.detail.data.response.items[0] })
					}
					break;
				default:
					console.log(e.detail.type);
			}
		});
		connect.send("VKWebAppGetAuthToken", {"app_id": 6918064, "scope": "market"});

		let hash = this.getLocationHash()
		if (hash === 'items') {
			this.setState({ activePanel : 'items' }, function() { this.getItems() })
		} else if (hash.indexOf('item') !== -1) {
			let id = hash.replace('item','')
			this.setState({ activePanel : 'item' }, function() { this.getInfoItem(id) })
		} else {
			this.setState({ activePanel : 'items' }, function() { this.getItems() })
		}
	}

	getItems() {
		const ownerId = -124527492
		connect.send("VKWebAppCallAPIMethod", {"method": "market.get", "params": {"owner_id": ownerId , "v":"5.92", "access_token": this.state.authToken, "request_id" : 1234567 }});
	}

	getInfoItem(id) {
		const ownerId = -124527492
		let itemId = `${ownerId}_${id}`
		connect.send("VKWebAppCallAPIMethod", {"method": "market.getById", "params": {"item_ids": itemId , "v":"5.92", "extended" : 1,  "access_token": this.state.authToken, "request_id" : 123 }});
	}

	go = (e, object) => {
		let activePanel = e.currentTarget.dataset.to
		this.setState({ activePanel : activePanel })
		if (activePanel === 'items') {
			connect.send("VKWebAppSetLocation", {"location": "items"});
			this.getItems()
		}
		if (activePanel === 'item') {
			connect.send("VKWebAppSetLocation", {"location": `item${object.itemId}`});
			this.getInfoItem(object.itemId)
		}
	}

	render() {
		return (
			<View activePanel={this.state.activePanel}>
				<Items 
					id="items" 
					items={this.state.items}
					go={this.go}
				/>
				<Item 
					id="item"
					item={this.state.item}
					go={this.go}
				/>
			</View>
		);
	}
}

export default App;
