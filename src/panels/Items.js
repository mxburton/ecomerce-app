import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Cell, List, PanelHeader, Group, Div } from '@vkontakte/vkui';
import { Link } from "react-router-dom";

class Items extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.getItems()
	}

	render() {
		let { 
			id, items 
		} = this.props

		return (
			<Panel id={id}>
				<PanelHeader>Товары</PanelHeader>
				<Group>
					<List>
						{
							items.length > 0 && items.map((item, index) => (
								<Link key={index} style={{ textDecoration : 'none' }} to={`/item/${item.id}`}>
									<Cell 
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
								</Link>
							))
						}
						{
							items.length == 0 &&
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

Items.propTypes = {
	id: PropTypes.string.isRequired
};

export default Items;
