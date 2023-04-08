import React from 'react';
import styles from './styles.module.scss'

function BlankLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.wrapBlankLayout }>
            <div className={styles.blankLayout}>
                {children}
            </div>
        </div>
    );
}

export default BlankLayout;
