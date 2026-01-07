'use client'
import { DeleteAccountButton } from "@/app/_components/DeleteAccountButton";
import { LogoutButton } from "@/app/_components/LogoutButton";

interface Props {
	params: {
		id: string;
	};
}




export default function Page({ params }: Props) {
	const { id } = params;


	return (
		<>
			<h1>Page { id }</h1>
			<p>Page content</p>
			
			
      		<span>My App</span>
			<h2>Login</h2>
      		<LogoutButton />
			<h2>DeleteAccount</h2>
    		<DeleteAccountButton/>
		

		</>
	);
}
