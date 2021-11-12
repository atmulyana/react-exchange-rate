import ReactLoading from 'react-loading';

export default function LoadingIndicator({show=false}) {
    let className = `modal fade show position-absolute justify-content-center align-items-center ${show ? 'd-flex' : 'd-none'}`;
    return <div
        class={className}
        tabindex="-1"
        aria-hidden="true"
    >
        <div
            class="modal-backdrop show position-absolute h-100 w-100"
            style={{zIndex: 0}}
        ></div>
        <ReactLoading color="blue" type="bars" />
    </div>;
}