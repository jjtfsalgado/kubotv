import * as React from "react";

import css from "./breadcrumb.less";

export interface ILevel {
    description: string;
    value?: string; //id, etc
    onClick: (level: ILevel) => void;
}

interface IBreadcrumbProps {
    levels: Array<ILevel>;
}

export const Breadcrumb = (props: IBreadcrumbProps) => {

    const {levels} = props;

    return (
        <div className={css.breadcrumb}>
            {levels.map(i => <Level {...i}/>)}
        </div>
    )
}

const Level = (item: ILevel) => {
    return (
        <div onClick={() => item.onClick(item)}><span>{item.description}</span></div>
    )
}
