import React, { useState } from "react";
import {
  Steps,
  Radio,
  Input,
  Checkbox,
  Button,
  Divider,
  Row,
  Col,
  Typography,
  Card,
} from "antd";
import { Tag } from "antd";
import { Upload, Space } from "antd";
import { UploadOutlined, GlobalOutlined } from "@ant-design/icons";
import { api } from "auth/FetchInterceptor";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Step } = Steps;


const RadioButtonWithTitleAndDes = ({
  options,
  selectedOption,
  setSelectedOption,
}) => {
  const handleChange = (value) => {
    setSelectedOption(value);
  };
  return (
    <div className="radio-options">
      {options?.map((elm, ind) => {
        return (
          <div
            key={ind}
            className={`radio-option-box ${selectedOption === elm.title ? "selected" : ""
              }`}
            onClick={() => handleChange(elm.title)}
          >
            {elm.title}
            <p>{elm.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

const VideoDurationSelector = ({ selections, setSelections }) => {

  const updateQuantity = (duration, increment) => {
    setSelections((prev) => ({
      ...prev,
      [duration]: {
        ...prev[duration],
        quantity: Math.max(0, prev[duration].quantity + increment),
      },
    }));
  };

  return (
    <div className="video-selector-container">
      <h3 className="video-selector-title">Videos from creator</h3>
      <div className="card-container">
        {Object.entries(selections).map(
          ([duration, { quantity, price }]) => (
            <div
              key={duration}
              className={`duration-card ${quantity > 0 ? "selected" : ""}`}
              onClick={() => updateQuantity(duration, 1)}
            >
              <div className="duration-text">Up to {duration} seconds</div>
              <div className="controls-container">
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(duration, -1);
                    }}
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
                  >
                    +
                  </button>
                </div>
                <div className="price">${price}</div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const options = {
  gender: ["Female", "Male"],
  age: ["18-24", "25-32", "33-44", "45+"],
  distinctives: [
    "African",
    "Asian",
    "European",
    "Latino",
    "Parent",
    "Plus Size",
    "Fit & Sporty",
    "Glamourous",
  ],
  language: ["English", "French", "Spanish", "Latin", "Arabic", "German"],
  accent: [
    "Aussie",
    "Arabic",
    "Asian",
    "European",
    "North American",
    "British",
  ],
  including: [
    "Dog",
    "Cat",
    "Other Pets",
    "Partner",
    "Baby",
    "Kids(2-6)",
    "Kids(7-12)",
    "Car",
  ],
  settings: ["Bathroom", "Kitchen", "Bedroom", "Pool", "Office", "Beach"],
};

const Campaigns = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [promotionType, setPromotionType] = useState(null);
  const [whatareyoupromoting, setWhatareyoupromoting] = useState(null);
  const [productName, setProductName] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [uploadScriptOrOtherAssets, setUploadScriptOrOtherAssets] = useState([]);
  const [category, setCategory] = useState([]);
  const [targetAudience, setTargetAudience] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [script, setScript] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [isGifted, setIsGifted] = useState(false);
  const [needsShipping, setNeedsShipping] = useState(false);

  let history = useHistory();

  const categories = [
    "Style",
    "Wellness",
    "Adventure",
    "Beauty",
    "Home",
    "Technology",
  ];

  const [brandWebsiteAndSocialPlatform, setBrandWebsiteAndSocialPlatform] = useState(["", "", ""]);

  const [selectedCriteria, setSelectedCriteria] = useState({
    gender: "",
    age: [],
    distinctives: [],
    language: [],
    accent: [],
    including: [],
    settings: [],
    specificCriteria: "",
  });

  const handleChange = (key, value) => {
    if (key == "specificCriteria") {
      setSelectedCriteria((prev) => {
        return { ...prev, specificCriteria: value };
      });
      return;
    }
    if (key == "cat") {
      setCategory((prev) => {
        return prev.includes(value) ? prev.filter((el) => el !== value) : [...prev, value]
      });
      return;
    }
    setSelectedCriteria((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const promotionoptions = [
    {
      title: "Reel Style",
      desc: "Creator generated script",
    },
    {
      title: "Video Ad Style",
      desc: "Client supplied script",
    },
  ];

  const aspectRatiooptions = [
    {
      title: "9:16",
      desc: "Reels, TikToks, Stories",
    },
    {
      title: "4:5",
      desc: "Feed placement, ads for SMM",
    },
    {
      title: "1:1",
      desc: "Carousel & Ads (square)",
    },
    {
      title: "16:9",
      desc: "Youtube display ads, website",
    },
  ];

  const [videosFromCreator, setVideosFromCreator] = useState({
    15: { quantity: 0, price: 50 },
    30: { quantity: 0, price: 70 },
    60: { quantity: 0, price: 99 },
  });

  const [campaignBudget, setCampaignBudget] = useState('')

  const [platforms, setPlatforms] = useState(["Instagram"]);
  const [aspectRatio, setAspectRatio] = useState("9:16");

  const handlePlatformChange = (checkedValues) => {
    setPlatforms(checkedValues);
  };

  const handleStepChange = (meth) => {
    if (meth == "prev") {
      setCurrentStep(currentStep - 1);
    } else {
      setCurrentStep(currentStep + 1);
    }
    console.log(selectedCriteria);
  };
  const createCampaign = () => {
    api
      .save("Campaigns", {
        what_are_you_promoting: whatareyoupromoting,
        video_type: promotionType,
        videos_from_creator: videosFromCreator,
        what_platforms_is_it_for: platforms,
        video_aspect_ratio: aspectRatio,
        genders: selectedCriteria.gender,
        ages: selectedCriteria.age,
        distinctives: selectedCriteria.distinctives,
        languages: selectedCriteria.language,
        accents: selectedCriteria.accent,
        includings: selectedCriteria.including,
        settings: selectedCriteria.settings,
        any_other_specific_criteria: selectedCriteria.any_other_specific_criteria,
        campaign_name: campaignName,
        product_name: productName,
        brand_name: brandName,
        product_brand_logo: brandLogo,
        categories: category,
        campaign_budget: campaignBudget,
        target_audience: targetAudience,
        what_do_you_want_to_see_in_the_video: videoDescription,
        what_do_you_want_them_to_say: script,
        what_is_the_call_to_action: callToAction,
        will_the_product_be_gifted_to_the_creator: isGifted,
        brand_website_social_platforms: brandWebsiteAndSocialPlatform,
        do_you_need_to_ship_your_product_to_the_creators: needsShipping,
        upload_script_or_other_assets: ["Script", "Assets"],
      })
      .then((res) => {
        history.push("/app/brands/campaigns/all-campaigns");
      });
  };

  const handleBrandLogoChange = async (info) => {
    const reader = new FileReader();
    reader.readAsDataURL(info.file);
    reader.onload = () => {
      api.uploadFile("Users", {
        file: reader.result,
        extension: info.file.name.split(".").pop(),
      }).then((res) => {
        if (res.success) {
          setBrandLogo(res.url);
          info.onSuccess();
        }
      });
    };
  };

  const handleScriptOrOtherAssetsChange = async (info) => {
    const reader = new FileReader();
    reader.readAsDataURL(info.file);
    reader.onload = () => {
      api.uploadFile("Users", {
        file: reader.result,
        extension: info.file.name.split(".").pop(),
      }).then((res) => {
        if (res.success) {
          setUploadScriptOrOtherAssets((pre) => [...pre, res.data]);
          info.onSuccess();
        }
      });
    };
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>New Campaign</Title>
      <Text type="secondary">Campaigns - Order Form</Text>

      <Steps
        current={currentStep}
        labelPlacement={"vertical"}
        style={{ margin: "25px 0" }}
      >
        <Step title="Project Details" />
        <Step title="Creator Criteria" />
        <Step title="Project Brief" />
      </Steps>

      {currentStep === 0 && (
        <div
          style={{
            border: "1px solid #d2d2d2",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
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
            <RadioButtonWithTitleAndDes
              options={promotionoptions}
              selectedOption={whatareyoupromoting}
              setSelectedOption={setWhatareyoupromoting}
            />
          </div>
          <VideoDurationSelector
            selections={videosFromCreator}
            setSelections={setVideosFromCreator}
          />
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
            <RadioButtonWithTitleAndDes
              options={aspectRatiooptions}
              selectedOption={aspectRatio}
              setSelectedOption={setAspectRatio}
            />
          </div>
        </div>
      )}
      {currentStep === 1 && (
        <div
          style={{
            border: "1px solid #d2d2d2",
            borderRadius: "8px",
            padding: "20px",
          }}
          className="creator-criteria-container"
        >
          <h2>Creator Criteria (select all that apply):</h2>

          <div className="criteria-section">
            <h3>Gender</h3>
            {options.gender.map((gender) => (
              <Tag.CheckableTag
                key={gender}
                checked={selectedCriteria.gender.includes(gender)}
                onChange={() => handleChange("gender", gender)}
              >
                {gender}
              </Tag.CheckableTag>
            ))}
          </div>

          <div className="criteria-section">
            <h3>Age</h3>
            <div>
              {options.age.map((age) => (
                <Tag.CheckableTag
                  key={age}
                  checked={selectedCriteria.age.includes(age)}
                  onChange={() => handleChange("age", age)}
                >
                  {age}
                </Tag.CheckableTag>
              ))}
            </div>
          </div>

          <div className="criteria-section">
            <h3>Distinctives</h3>
            <div>
              {options.distinctives.map((distinctives) => (
                <Tag.CheckableTag
                  key={distinctives}
                  checked={selectedCriteria.distinctives.includes(distinctives)}
                  onChange={() => handleChange("distinctives", distinctives)}
                >
                  {distinctives}
                </Tag.CheckableTag>
              ))}
            </div>
          </div>

          <div className="criteria-section">
            <h3>Language</h3>
            <div>
              {options.language.map((language) => (
                <Tag.CheckableTag
                  key={language}
                  checked={selectedCriteria.language.includes(language)}
                  onChange={() => handleChange("language", language)}
                >
                  {language}
                </Tag.CheckableTag>
              ))}
            </div>
          </div>

          <div className="criteria-section">
            <h3>Accent</h3>
            <div>
              {options.accent.map((accent) => (
                <Tag.CheckableTag
                  key={accent}
                  checked={selectedCriteria.accent.includes(accent)}
                  onChange={() => handleChange("accent", accent)}
                >
                  {accent}
                </Tag.CheckableTag>
              ))}
            </div>
          </div>

          <div className="criteria-section">
            <h3>Including</h3>
            <div>
              {options.including.map((including) => (
                <Tag.CheckableTag
                  key={including}
                  checked={selectedCriteria.including.includes(including)}
                  onChange={() => handleChange("including", including)}
                >
                  {including}
                </Tag.CheckableTag>
              ))}
            </div>
          </div>

          <div className="criteria-section">
            <h3>Settings</h3>
            <div>
              {options.settings.map((settings) => (
                <Tag.CheckableTag
                  key={settings}
                  checked={selectedCriteria.settings.includes(settings)}
                  onChange={() => handleChange("settings", settings)}
                >
                  {settings}
                </Tag.CheckableTag>
              ))}
            </div>
          </div>

          <div className="criteria-section">
            <h3>Any other specific criteria?</h3>
            <TextArea
              rows={4}
              value={selectedCriteria.specificCriteria}
              onChange={(e) => handleChange("specificCriteria", e.target.value)}
              placeholder="Specify and describe your preference of creators"
            />
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div className="product-form">
          <div
            style={{
              border: "1px solid #d2d2d2",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <div className="styled-radio-group">
              <h3>Campaign name</h3>
              <Input
                type="text"
                placeholder="Name of your campaign"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="styled-input"
              />
            </div>

            <div className="styled-radio-group">
              <h3>Product name</h3>
              <Input
                type="text"
                placeholder="Name of your product"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="styled-input"
              />
            </div>

            <div className="styled-radio-group">
              <h3>Brand name</h3>
              <Input
                type="text"
                placeholder="Name of your brand"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="styled-input"
              />
            </div>

            <div className="styled-radio-group">
              <h3>Product Brand logo</h3>
              <Upload maxCount={1} customRequest={handleBrandLogoChange}>
                <Button icon={<UploadOutlined />}>Upload file</Button>
              </Upload>
            </div>

            <div className="styled-radio-group orange-theme-tags">
              <h3>Category</h3>
              {categories.map((cat) => (
                <Tag.CheckableTag
                  key={cat}
                  checked={category.includes(cat)}
                  onChange={() => handleChange("cat", cat)}
                >
                  {cat}
                </Tag.CheckableTag>
              ))}
            </div>

            <div className="styled-radio-group">
              <h3>Target audience</h3>
              <TextArea
                rows={4}
                placeholder="What do they have in common?"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="styled-textarea"
              />
            </div>

            <div className="styled-radio-group">
              <h3>What do you want to see in the video?</h3>
              <TextArea
                rows={4}
                placeholder="Please describe what you want to see in the video"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="styled-textarea"
              />
            </div>

            <div className="styled-radio-group">
              <h3>What do you want them to say?</h3>
              <TextArea
                rows={4}
                placeholder="What are the key selling points? What should the creator focus on?"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="styled-textarea"
              />
            </div>

            <div className="styled-radio-group">
              <h3>What is the call to action?</h3>
              <TextArea
                rows={4}
                type="text"
                placeholder="e.g. Order now, Download now, Click the link below etc."
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                className="styled-input"
              />
            </div>
            <div className="styled-radio-group">
              <h3>Campaign Budget</h3>
              <Input
                type="text"
                prefix={"$"}
                placeholder="100"
                value={campaignBudget}
                onChange={(e) => setCampaignBudget(e.target.value)}
                className="styled-input"
              />
            </div>

            <div className="radio-buttons">
              <h3>Will the product be gifted to the creator?</h3>
              <Radio.Group
                value={isGifted}
                onChange={(e) => setIsGifted(e.target.value)}
              >
                <Radio value={true}>Gifted</Radio>
                <Radio value={false}>Not Gifted</Radio>
              </Radio.Group>
            </div>

            <div className="styled-radio-group">
              <h3>Brand website & social platforms</h3>
              <Space direction="vertical" style={{ width: "100%" }}>
                {brandWebsiteAndSocialPlatform.map((elm, i) => {
                  let placeholder = [
                    "www.yourwebsite.com",
                    "instagram.com/yourprofile",
                    "yourotherprofile.com/profilename",
                  ];
                  return (
                    <Input
                      type="text"
                      placeholder={placeholder[i]}
                      className="styled-input"
                      value={elm}
                      onChange={(e) =>
                        setBrandWebsiteAndSocialPlatform((pre) =>
                          pre.map((element, ind) =>
                            ind === i ? e.target.value : element
                          )
                        )
                      }
                    />
                  );
                })}
                {/* <Input
                            type="text"
                            placeholder="instagram.com/yourprofile"
                            className="styled-input"
                          />
                          <Input
                            type="text"
                            placeholder="yourotherprofile.com/profilename"
                            className="styled-input"
                          /> */}
              </Space>
            </div>

            <div className="radio-buttons">
              <h3>Do you need to ship your product to the creators?</h3>
              <Radio.Group
                value={needsShipping}
                onChange={(e) => setNeedsShipping(e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </div>

            <div className="styled-radio-group">
              <h3>Upload script or other assets</h3>
              <Upload customRequest={handleScriptOrOtherAssetsChange}>
                <Button icon={<UploadOutlined />}>Upload files</Button>
              </Upload>
            </div>
          </div>
        </div>
      )}
      <div className="steps-actions">
        <Button
          disabled={currentStep === 0}
          onClick={() => handleStepChange("prev")}
        >
          Back
        </Button>
        {currentStep != 2 && (
          <Button
            disabled={currentStep === 2}
            onClick={() => handleStepChange("next")}
          >
            Next
          </Button>
        )}
        {currentStep == 2 && (
          <Button onClick={() => createCampaign()}>Create Campaign</Button>
        )}
      </div>
      {/* Additional step content can be added for other steps here */}
    </div>
  );
};

export default Campaigns;
