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
					this.setState({ authToken : e.detail.data.access_token }, function() {
						let hash = this.getLocationHash()
						if (hash === 'items') {
							this.setState({ activePanel : 'items' }, function() { this.getItems() })
						} else if (hash.indexOf('item') !== -1) {
							let id = hash.replace('item','')
							this.setState({ activePanel : 'item' }, function() { this.getInfoItem(id) })
						} else {
							this.setState({ activePanel : 'items' }, function() { this.getItems() })
						}
					});
					break;
				case 'VKWebAppCallAPIMethodResult':
					if (e.detail.data.request_id === "items") {
						this.setState({ items : e.detail.data.response.items })
					}
					if (e.detail.data.request_id === "item") {
						this.setState({ item : e.detail.data.response.items[0] })
					}
					break;
				default:
					console.log(e.detail);
			}
		});
		connect.send("VKWebAppGetAuthToken", {"app_id": 6906999, "scope": "market"});
	}

	getItems() {
		const ownerId = -124527492
		connect.send("VKWebAppCallAPIMethod", {"method": "market.get", "request_id" : "items", "params": {"owner_id": ownerId , "v":"5.92", "access_token": this.state.authToken }});
	}

	getInfoItem(id) {
		const ownerId = -124527492
		let itemId = `${ownerId}_${id}`
		connect.send("VKWebAppCallAPIMethod", {"method": "market.getById", "request_id" : "item",  "params": {"item_ids": itemId , "v":"5.92", "extended" : 1,  "access_token": this.state.authToken }});
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
