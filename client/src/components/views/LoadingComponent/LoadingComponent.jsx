import React, { memo } from 'react';
import { LoadingContainer, LoadingSpinner } from '../../styled/StyledComponent';
import Spinner from '../../styled/spinner.gif';

const LoadingComponent = memo(() => {
    return (
        <LoadingContainer>
            <LoadingSpinner />
        </LoadingContainer>
    );
});

export default LoadingComponent;