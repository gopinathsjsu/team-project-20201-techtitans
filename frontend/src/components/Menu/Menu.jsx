import { useState, useEffect } from "react";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Menu.css";

function Menu(props) {
	const { id } = props;
	const [menus, setMenus] = useState([]);

	async function fetchMenus() {
		try {
			const response = await axios.get(
				`http://127.0.0.1:5000/menu/${id}`
			);
			return response;
		} catch (error) {
			return false;
		}
	}

	useEffect(() => {
		fetchMenus().then((result) => {
			setMenus(result.data);
		});
	}, [menus]);

	const menuDetails = menus.map((menu) => (
		<div className="menu">
			<Accordion
				sx={{
					backgroundColor: "transparent",
					boxShadow: "none",
					color: "white",
				}}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
					aria-controls="panel1-content"
					id="panel1-header"
				>
					<Typography component="span">
						<h4 className="menu-title">{menu.title}</h4>
					</Typography>
				</AccordionSummary>
				<hr />
				<AccordionDetails sx={{ color: "white" }}>
					<div>
						{menu.dishes.map((item, idx) => (
							<>
								<div className="menu-item">
									<b className="item-text">{item.name}</b>
									<b className="item-price">
										{item.cost[
											"$numberDecimal"
										].toLocaleString()}
									</b>
								</div>
								<p className="item-text">{item.description}</p>
								<img className="item-photo" src={item.photo} />
								<hr />
							</>
						))}
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	));

	return (
		<div className="menu-section">
			<h2>Menus</h2>
			{menuDetails}
		</div>
	);
}

export default Menu;
