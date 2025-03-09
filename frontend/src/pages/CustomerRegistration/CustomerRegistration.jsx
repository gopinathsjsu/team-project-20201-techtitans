import "./CustomerRegistration.css";
import Navbar from "../../components/Navbar/Navbar";
import CustomerRegister from "../../components/CustomerRegister";

function CustomerRegistration() {
	return (
		<>
			<Navbar role="signed-out" />
			<div
				className="customer-registration-fields-btns"
				style={{ display: "flex", flexDirection: "column" }}
			>
				<CustomerRegister />
			</div>
		</>
	);
}

export default CustomerRegistration;
