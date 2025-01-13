import React, { useState } from "react";
import { Steps, Radio, InputNumber, Checkbox, Button, Divider, Row, Col, Typography, Card } from "antd";

const { Title, Text } = Typography;
const { Step } = Steps;

// RADIO BUTTON WITH TITLE AND DESC

const RadioButtonWithTitleAndDes = ({ options, selectedOption, setSelectedOption }) => {

    const handleChange = (value) => {
        setSelectedOption(value);
    };
    return (
        <div className="radio-options">
            {
                options?.map((elm, ind) => {
                    return (

                        <div key={ind}
                            className={`radio-option-box ${selectedOption === elm.title ? "selected" : ""
                                }`}
                            onClick={() => handleChange(elm.title)}
                        >
                            {elm.title}
                            <p>{elm.desc}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}


// RADIO BUTTON WITH TITLE AND DESC




// VIDEO FROM CREATER COMPONENT

const VideoDurationSelector = ({ selections, setSelections }) => {

    const handleSelect = (duration) => {
        setSelections(prev => ({
            ...prev,
            [duration]: {
                ...prev[duration],
                selected: !prev[duration].selected
            }
        }));
    };

    const updateQuantity = (duration, increment) => {
        if (!selections[duration].selected) return;

        setSelections(prev => ({
            ...prev,
            [duration]: {
                ...prev[duration],
                quantity: Math.max(0, prev[duration].quantity + increment)
            }
        }));
    };

    return (
        <div className="video-selector-container">
            <h3 className="video-selector-title">Videos from creator</h3>
            <div className="card-container">
                {Object.entries(selections).map(([duration, { selected, quantity, price }]) => (
                    <div
                        key={duration}
                        className={`duration-card ${selected ? 'selected' : ''}`}
                        onClick={() => handleSelect(duration)}
                    >
                        <div className="duration-text">
                            Up to {duration} seconds
                        </div>
                        <div className="controls-container">
                            <div className="quantity-controls">
                                <button
                                    className="quantity-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(duration, -1);
                                    }}
                                    disabled={!selected}
                                >
                                    -
                                </button>
                                <span className="quantity">{quantity}</span>
                                <button
                                    className="quantity-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(duration, 1);
                                    }}
                                    disabled={!selected}
                                >
                                    +
                                </button>
                            </div>
                            <div className="price">${price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// VIDEO FROM CREATER COMPONENT






const Campaigns = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [promotionType, setPromotionType] = useState("Digital Product");
    const [whatareyoupromoting, setWhatareyoupromoting] = useState("Video Ad Style");
    const promotionoptions = [
        {
            title: "Reel Style",
            desc: "Creator generated script"
        },
        {
            title: "Video Ad Style",
            desc: "Client supplied script"
        }
    ];

    const aspectRatiooptions = [
        {
            title: "9:16",
            desc: "Reels, TikToks, Stories"
        },
        {
            title: "4:5",
            desc: "Feed placement, ads for SMM"
        },
        {
            title: "1:1",
            desc: "Carousel & Ads (square)"
        },
        {
            title: "16:9",
            desc: "Youtube display ads, website"
        }
    ];
    const [videosFromCreator, setVideosFromCreator] = useState({
        '15': { selected: true, quantity: 2, price: 50 },
        '30': { selected: false, quantity: 0, price: 70 },
        '60': { selected: true, quantity: 1, price: 99 }
    });

    const [videoCounts, setVideoCounts] = useState({
        short: 2,
        medium: 0,
        long: 1,
    });
    const [platforms, setPlatforms] = useState(["Instagram"]);
    const [aspectRatio, setAspectRatio] = useState("9:16");

    const handleVideoCountChange = (type, value) => {
        setVideoCounts({ ...videoCounts, [type]: value });
    };

    const handlePlatformChange = (checkedValues) => {
        setPlatforms(checkedValues);
    };

    return (
        <div style={{ padding: "20px" }}>
            <Title level={3}>New Campaign</Title>
            <Text type="secondary">Campaigns  - Order Form</Text>

            <Steps current={currentStep} labelPlacement={'vertical'} style={{ margin: "25px 0" }}>
                <Step title="Project Details" />
                <Step title="Creator Criteria" />
                <Step title="Project Brief" />
                <Step title="Payment" />
            </Steps>

            {currentStep === 0 && (
                <div style={{ border: '1px solid #d2d2d2', borderRadius: '8px', padding: '20px' }}>
                    <div className="radio-buttons">
                        <h3>What are you promoting?</h3>
                        <Radio.Group
                            onChange={(e) => setPromotionType(e.target.value)}
                            value={promotionType}
                        >
                            <Radio value="Product">Product</Radio>
                            <Radio value="Digital Product">Digital Product</Radio>
                            <Radio value="Service">Service</Radio>
                        </Radio.Group>
                    </div>

                    <div className="styled-radio-group">
                        <h3>What are you promoting?</h3>
                        <RadioButtonWithTitleAndDes options={promotionoptions} selectedOption={whatareyoupromoting} setSelectedOption={setWhatareyoupromoting} />

                    </div>
                    <VideoDurationSelector selections={videosFromCreator} setSelections={setVideosFromCreator} />
                    {/* <Title level={5} style={{ marginTop: "20px" }}>What platform(s) is it for?</Title> */}
                    <div className="styled-radio-group">
                        <h3>What platform(s) is it for?</h3>
                    <Checkbox.Group
                        className="orangeCheckBox"
                        options={["Instagram", "TikTok", "Facebook", "Youtube"]}
                        value={platforms}
                        onChange={handlePlatformChange}
                    />
                    </div>
                    <div className="styled-radio-group">
                        <h3>Video aspect ratio</h3>
                        <RadioButtonWithTitleAndDes options={aspectRatiooptions} selectedOption={aspectRatio} setSelectedOption={setAspectRatio} />

                    </div>
                </div>
            )}
            <div className="steps-actions">
                <button
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(currentStep - 1)}
                >
                    Previous
                </button>
                <button
                    disabled={currentStep === 3}
                    onClick={() => setCurrentStep(currentStep + 1)}
                >
                    Next
                </button>
            </div>
            {/* Additional step content can be added for other steps here */}
        </div>
    );
};

export default Campaigns;
