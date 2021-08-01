import React, { useEffect, useState } from 'react';
import {Layout, Title} from "../components/Common";
import Button from "../components/Common/Button/Button";

export default function Connection(props) {
	//executed when component is created (one time)
    useEffect(() => {
		// console.log('connecté !');
	}, []);
	
	return (
        <Layout>
            <div className="md:flex">
                <div className="bg-blue-darker-blue rounded-md p-6 pt-2 w-100 md:max-w-xs lg:w-100 xl:w-100 2xl:w-100">
                    <div className="mt-4">
                        <form>
                            <Title>Pseudo</Title>
                            <input className="bg-blue-200 w-full border-2 rounded border-yellow-light-yellow pl-2 text-white-white" type="text" value={props.username} onChange={(e) => props.onHandleUsername(e)} />
                            <Button className="mt-2" onClick={() => props.onSubmitUsername()}>Done !</Button><br/>
                            <Button className="mt-2" onClick={() => props.onClearStorage()}>Nettoyer</Button>
                        </form>
                    </div>
				</div>
            </div>
        </Layout>
    );
}