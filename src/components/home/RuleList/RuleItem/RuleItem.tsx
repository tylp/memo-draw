import React from 'react'
import { RuleItemSpec } from './RuleItem.spec';

const RuleItem = (props: RuleItemSpec) : JSX.Element => {
    return (
        <div className="flex mb-7">
            <div className="items-center text-center bg-white-white rounded-full h-12 w-12 mr-8">
                <div className="text-blue-blue font-black text-4xl">{props.id}</div>
            </div>
            <div className="max-w-sm bg-blue-darker-blue rounded-md p-3">
                <div className="text-lg font-semibold text-white-white mb-1">{props.title}</div>
                <div className="text-sm text-white-white">{props.content}</div>
            </div>
        </div>
    )
}

export default RuleItem;
