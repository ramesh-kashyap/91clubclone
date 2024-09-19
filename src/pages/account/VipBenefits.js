import React from 'react';

const VipBenefits = ({ vipDetails, activeSection }) => {


 if (!vipDetails || vipDetails.length === 0) {
    return <div>No VIP details available for this section.</div>;
  }

    console.log(vipDetails.vipRules[0]);
  // Check if vipDetails and vipRules are available and is an array with elements
  if (!vipDetails || !Array.isArray(vipDetails.vipRules) || vipDetails.vipRules.length === 0) {
    return <div>Loading VIP details...</div>;
  }

  // Ensure activeSection is within the bounds of vipRules array
  const index = parseInt(activeSection.replace('section', '')) - 1;

  const data = vipDetails.vipRules[index];

  // If no data for the given section, render a placeholder
  if (!data) {
    return <div>No VIP details available for this section.</div>;
  }

  return (
    <div data-v-9bb5e81c="" data-v-92d3d2e1="" className="vip-content-weal">
      <div data-v-9bb5e81c="" className="slide">

        {/* VIP Benefits Heading */}
        <div data-v-9bb5e81c="" className="vip-content-weal-head ar-1px-b">
          <svg data-v-9bb5e81c="" className="svg-icon icon-diamond">
            <use href="#icon-diamond"></use>
          </svg>
          <h1 data-v-9bb5e81c="">VIP {data.vip_level} - Section Benefits</h1>
        </div>

        {/* Level Up Rewards */}
        <div data-v-9bb5e81c="" className="vip-content-weal-con">
          <div data-v-9bb5e81c="">
            <img data-v-9bb5e81c="" src="/assets/png/1-fd9896f4.png" alt="Level Up Rewards" />
          </div>
          <div data-v-9bb5e81c="">
            <h2 data-v-9bb5e81c="">Level up rewards</h2>
            <span data-v-9bb5e81c="">Each account can only receive 1 time</span>
          </div>
          <div data-v-9bb5e81c="">
            <p data-v-9bb5e81c="">
              <img data-v-9bb5e81c="" src="/assets/png/gold-4a60a059.png" alt="Gold" />
              {data.level_up_reward}
            </p>
            <p data-v-9bb5e81c="">
              <svg data-v-9bb5e81c="" className="svg-icon icon-love">
                <use href="#icon-love"></use>
              </svg>
              0
            </p>
          </div>
        </div>

        {/* Monthly Rewards */}
        <div data-v-9bb5e81c="" className="vip-content-weal-con">
          <div data-v-9bb5e81c="">
            <img data-v-9bb5e81c="" src="/assets/png/2-0a41a908.png" alt="Monthly Reward" />
          </div>
          <div data-v-9bb5e81c="">
            <h2 data-v-9bb5e81c="">Monthly reward</h2>
            <span data-v-9bb5e81c="">Each account can only receive 1 time per month</span>
          </div>
          <div data-v-9bb5e81c="">
            <p data-v-9bb5e81c="">
              <img data-v-9bb5e81c="" src="/assets/png/gold-4a60a059.png" alt="Gold" />
              {data.monthly_reward}
            </p>
            <p data-v-9bb5e81c="">
              <svg data-v-9bb5e81c="" className="svg-icon icon-love">
                <use href="#icon-love"></use>
              </svg>
              0
            </p>
          </div>
        </div>

        {/* Rebate Rate */}
        <div data-v-9bb5e81c="" className="vip-content-weal-con">
          <div data-v-9bb5e81c="">
            <img data-v-9bb5e81c="" src="/assets/png/5-5e6a64b1.png" alt="Rebate Rate" />
          </div>
          <div data-v-9bb5e81c="">
            <h2 data-v-9bb5e81c="">Rebate rate</h2>
            <span data-v-9bb5e81c="">Increase income of rebate</span>
          </div>
          <div data-v-9bb5e81c="">
            <p data-v-9bb5e81c="" className="max">
              <svg data-v-9bb5e81c="" className="svg-icon icon-weal5">
                <use href="#icon-weal5"></use>
              </svg>
              0.05%
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VipBenefits;
