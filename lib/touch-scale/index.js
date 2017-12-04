import React, {Component} from 'react';

import PropTypes from 'prop-types';

import classnames from 'classnames';

import './s.css';

export default class TouchScale extends Component {

    static propTypes = {
        hoverTransition:PropTypes.number,
        leaveScaleAnmTime:PropTypes.number,
        isWillChange:PropTypes.bool,
        hoverColor:PropTypes.string,
        activeColor:PropTypes.string,
        prefixClass:PropTypes.string,
        tag:PropTypes.string,
        tagClass:PropTypes.string,
        contentClass:PropTypes.string,
    }

    static defaultProps = {
        tag:"div",
        prefixClass:"scale",
        tagClass:"",
        contentClass:"",
        leaveScaleDuration:500,
        hoverStayTime:500,
    }

    state = {
        hover:false,
        active:false,
        eleStyle:null,
        position:{left:"50%",top:"50%"},
        moveNum:0,
    }

    currentHandleEve = null; //当前操作元素的 event

    handleTouchStart = (event)=>{

        if(this.state.hover) return

        this.setState({ hover:true })

    }

    handleTouchMove = (event)=>{

        const {hover} = this.state;

        if(!hover) return;

        this.setState(()=>({
            moveNum:this.state.moveNum+1
        }))

        if(this.state.moveNum === 35){

            this.setState({
                moveNum:0
            })

            this.handleTouchEnd(event)
        }

    }

    handleTouchEnd = (event)=>{

        const {hover} = this.state;

        const {leaveScaleDuration,hoverStayTime} = this.props;

        if(!hover) return

        this.openCurrentPositionAnm(event);

        setTimeout(()=>{

            this.setState({ hover:false,eleStyle:null,active:false})

        },Math.max(leaveScaleDuration,hoverStayTime));

    }

    getCurrentTouchPosition(event){

        let left,top;

        if(event){

            const ele = event.target;

            const clientRect = ele.getBoundingClientRect()

            const firstTouchInfo = event.changedTouches[0];

            if(clientRect && firstTouchInfo){
                left = Number((firstTouchInfo.clientX - clientRect.left).toFixed(3));
                top = Number((firstTouchInfo.clientY - clientRect.top).toFixed(3))
            }
        }

        return {left,top}
    }

    openCurrentPositionAnm = (event)=>{

        const {left,top} = this.getCurrentTouchPosition(event);

        if(left && top){
            this.setState({active:true,eleStyle:{
                left,top,
                animationDuration:this.props.leaveScaleDuration + "ms",
                willChange:'transform'
            }})
        }else{
            this.setState({ eleStyle:null })
        }
    }

    render() {

        const {tag,style,children,prefixClass,tagClass,contentClass} = this.props;

        const {eleStyle,hover,active} = this.state;

        const elStyle = style ? Object.assign(eleStyle,style) : eleStyle;

        const _this = this;

        return  React.createElement(tag, {
                    className: classnames({[`${prefixClass}-touch-tag`]:true,
                                           [`${prefixClass}-touch-hover`]:hover,
                                           [`${prefixClass}-touch-active`]:active}) + ` ${tagClass}`,
                    onTouchStart:_this.handleTouchStart,
                    onTouchEnd:_this.handleTouchEnd,
                    onTouchMove:_this.handleTouchMove,
                    onTouchCancel:_this.handleTouchEnd,
                    children: <React.Fragment>
                        <div data-type="background" style={elStyle}></div>
                        <div data-type="content" className={contentClass}> {children} </div>
                    </React.Fragment>

        })
    }
}