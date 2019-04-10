import React from 'react';
import connect from '@vkontakte/vkui-connect'; //@vkontakte/vkui-connect-mock - для отладки
import { View, ConfigProvider } from '@vkontakte/vkui';
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
			item : null,
			history : ['items']
		};
	}

	getLocationHash() {
		return window.location.hash.replace('#','')
	}

	getObjectUrlString(string) {
		let search = string
		let objectUrl = search === "" ? null : search.split("&").reduce((prev, curr) => {
			const [key, value] = curr.split("=");
			prev[decodeURIComponent(key)] = decodeURIComponent(value);
			return prev;
		}, {});
		return objectUrl
	}

	getActivePanelRenderString() {
		const stringHash = this.getLocationHash()
		const objectParametrs = this.getObjectUrlString(stringHash)
		const renderStingActivePanel = 'items'

		if (objectParametrs !== null && typeof objectParametrs.itemId !== 'undefined') {
			renderStingActivePanel = 'item'
		}

		return renderStingActivePanel
	}

	componentWillMount() {

		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppAccessTokenReceived':
					this.setState({ authToken : e.detail.data.access_token }, function() {
						let stringActivePanel = this.getActivePanelRenderString()
						if (stringActivePanel === 'items') {
							this.setState({ activePanel : 'items' }, () => { this.getItems() })
						} else if (stringActivePanel.indexOf('item') !== -1) {
							const stringHash = this.getLocationHash()
							const objectParametrs = this.getObjectUrlString(stringHash)
							const id = objectParametrs.itemId
							this.setState({ activePanel : 'item' }, () => { this.getInfoItem(id) })
						} else {
							this.setState({ activePanel : 'items' }, () => { this.getItems() })
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
		const history = [...this.state.history];
		history.push(activePanel);

		if (this.state.activePanel === 'items') {
			connect.send('VKWebAppEnableSwipeBack');
		}
		this.setState({  history, activePanel })
		if (activePanel === 'items') {
			this.getItems()
		}
		if (activePanel === 'item') {
			this.getInfoItem(object.itemId)
		}
	}

	goBack = () => {
		const history = [...this.state.history];
		history.pop();
		const activePanel = history[history.length - 1];
		if (activePanel === 'items') {
		  connect.send('VKWebAppDisableSwipeBack');
		}
		this.setState({ history, activePanel });
	}

	render() {
		return (
			<ConfigProvider isWebView={true}>
				<View 
					onSwipeBack={this.goBack} 
					history={this.state.history} 
					activePanel={this.state.activePanel}>
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
			</ConfigProvider>
		);
	}
}

export default App;
