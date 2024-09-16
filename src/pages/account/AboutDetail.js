import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function AboutDetail() {
 const navigate = useNavigate();
  return (
    <div style={{fontSize: '12px'}}>




    <div id="app" data-v-app="">
      <div
        data-v-647954c7=""
        className="ar-loading-view"
        style={{
          '--f13b4d11CurrentFontFamily':"'Roboto', 'Inter', 'sansSerif'",
          display: 'none'
        }}
      >
        <div data-v-647954c7="" className="loading-wrapper">
          <div data-v-647954c7="" className="loading-animat">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              width="200"
              height="200"
              preserveAspectRatio="xMidYMid meet"
              style={{
                width: '100%',
                height: '100%',
                transform: 'translate3d(0px, 0px, 0px)',
                contentVisibility: 'visible'
    }}
            >
              <defs>
                <clipPath id="__lottie_element_2">
                  <rect width="200" height="200" x="0" y="0"></rect>
                </clipPath>
                <image
                  href="data:image/png;base64,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"
                ></image>
                <image
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAHlBMVEVHcEy/GyDCGiHCGiDBGiHBGiLBGiG/GyC/HCDBGiEYgX5lAAAACXRSTlMAFupex4emMEAHMN8rAAAEw0lEQVR42u1cy1ITQRTtYTKZsAsQLLODUsDeoVWC2YGSSHYC8ZEdolU6Owopq9gpisJOhwS5f2vPDENek2QefW5ZyF0BReZM9z3nPjrdLURimxJwM+p0Dw5SIqJl9ECaCmQO93z7pLFBvv1BjeDkPV3bJQbicZ267DcC4ySAcGsvT3+W1Q+7+iHMPR+huhr8RtQqasf4IRVEa+f6wbM17Qw2tr1RvCsiZVFwFMbCPlR6pvK4+xorb1O542IZj7FQxGIUFAY64Np1PIYXbuGJ4xEDhspNbbDPPWK10BiGQy46x4pjoi00hsXgdFX1XKAdIg7wRY/HrCV4+VbBs1fkIYVCnzl0LvADwctQ0Rfv9RK5+wweWWfwCJ6+aiDzcAyLwyMVBmrZHAOZZhC7EuIyA38vBIPb8UK0pYsXYonB7aJJL+AYBWoJBpEsccwWXiQ2x2zlMCsm/UrEc8uQLn4gFmgRq8fKtIYHcQgftwyOKJ/nIHCZgcDCcW+ISywOl0wzNFcqcOGLOlFnCPM2RwmRR35ZEdoEhxRZ/O4wJCyDw+8mh97zHFmRhVxHHORqMpBL1BmSieBgcIGDwRZHeMxzpEUWmZTpCx7kjKEM5tGi0+IQfJsBRDIIXnA0cjZsX0UPyC+O+MgAYnJk+JsDYnFEeosj0t+CxLXDIh7EkGt4kCCg3IL8SyCmX5+CY5flP/4mgUCL+pwf5ME5Pufzysb2QBPBNybYumsy6BmwLWM56N+xtfAZBVU9tMO+akya0NbhqjGpEENjcgTtGa9oNYn87i/sGXLI6s68iicWMkKGC3bQtZVwJQK6zlkOHY6UfCVciUCuFlwvElSA6x6y3T9vCJlcXtMMJpTOgh1whbsjdOB3NF2ewK3ZNjucwtFLXkQNSje5zruiGKi+636wiaqKprs7BgnyfI+zmyDPy1YPnSGNUKFHgHnM9sdcD6EKGM2f9U5QHZJS+vYrVBByNKjdl+/nEFKc7yuPzuEu8ZyiXykDzzzTrxST2gOU1p4dJwbEZ+vfuRKxiU/7vj5DtiKi8rxuAl/GcFPmMB9RaNX1NlxG5HZazfOVj5S3pXe+KtFlqdbN1caQzcda5ys3JBiaOnenDt187Oir7s2hZyY07q8+GLr52Ja6tn0YcjiJtB11KI2Qg6Xr9MlI72o6RzP6qExOD4ubIxVn1HWw2BxzwqSkI0GO449i8W72gYwLggfZh1IZq2k1lPWs1BofzQ+yaiXOAb+sh+finYtT/5Uh2dvx3lENJUMwPqbWfkzPvc1A3/W4HIz3NhGz4MRWQEGmPVt8nOAw72HKCbOIHiQJo2kOmipmJdGYKdMclG4mPPl8J8WRb+WQ58k+8YhoM9kn1Hu1k5MxmfNnZQrie7dIbCXyYhquqFdztxJgpGO9muS4KDMysQs78ZjoQ8xBp8UQ4rtCeTZeLyuU6Y6Dz+rji2M4498tsykymDcRo291+eTd9PMxW1kw4z1jcSg5Cw2iBCQcGvW82aBqZEa2V7ybfrTcLeM/iapPBiaq4V+JpOmmH3M7uGCp+uZr+Ke7314Fty4tPtTWZs7shddE3d9Q9jT8bXFV60rJTIMGrKYXwtfDSUN2ANzazr7AmDF16ttUUfyf9hdhzrd5F3WCHQAAAABJRU5ErkJggg=="
                ></image>
              </defs>
              <g clipPath="url(#__lottie_element_2)">
                <g
                  className="ai"
                  transform="matrix(1,0,0,1,0,0)"
                  opacity="1"
                  style={{display: 'block'}}
                >
                  <image
                    width="200px"
                    height="200px"
                    preserveAspectRatio="xMidYMid slice"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAHlBMVEVHcEy/GyDCGiHCGiDBGiHBGiLBGiG/GyC/HCDBGiEYgX5lAAAACXRSTlMAFupex4emMEAHMN8rAAAEw0lEQVR42u1cy1ITQRTtYTKZsAsQLLODUsDeoVWC2YGSSHYC8ZEdolU6Owopq9gpisJOhwS5f2vPDENek2QefW5ZyF0BReZM9z3nPjrdLURimxJwM+p0Dw5SIqJl9ECaCmQO93z7pLFBvv1BjeDkPV3bJQbicZ267DcC4ySAcGsvT3+W1Q+7+iHMPR+huhr8RtQqasf4IRVEa+f6wbM17Qw2tr1RvCsiZVFwFMbCPlR6pvK4+xorb1O542IZj7FQxGIUFAY64Np1PIYXbuGJ4xEDhspNbbDPPWK10BiGQy46x4pjoi00hsXgdFX1XKAdIg7wRY/HrCV4+VbBs1fkIYVCnzl0LvADwctQ0Rfv9RK5+wweWWfwCJ6+aiDzcAyLwyMVBmrZHAOZZhC7EuIyA38vBIPb8UK0pYsXYonB7aJJL+AYBWoJBpEsccwWXiQ2x2zlMCsm/UrEc8uQLn4gFmgRq8fKtIYHcQgftwyOKJ/nIHCZgcDCcW+ISywOl0wzNFcqcOGLOlFnCPM2RwmRR35ZEdoEhxRZ/O4wJCyDw+8mh97zHFmRhVxHHORqMpBL1BmSieBgcIGDwRZHeMxzpEUWmZTpCx7kjKEM5tGi0+IQfJsBRDIIXnA0cjZsX0UPyC+O+MgAYnJk+JsDYnFEeosj0t+CxLXDIh7EkGt4kCCg3IL8SyCmX5+CY5flP/4mgUCL+pwf5ME5Pufzysb2QBPBNybYumsy6BmwLWM56N+xtfAZBVU9tMO+akya0NbhqjGpEENjcgTtGa9oNYn87i/sGXLI6s68iicWMkKGC3bQtZVwJQK6zlkOHY6UfCVciUCuFlwvElSA6x6y3T9vCJlcXtMMJpTOgh1whbsjdOB3NF2ewK3ZNjucwtFLXkQNSje5zruiGKi+636wiaqKprs7BgnyfI+zmyDPy1YPnSGNUKFHgHnM9sdcD6EKGM2f9U5QHZJS+vYrVBByNKjdl+/nEFKc7yuPzuEu8ZyiXykDzzzTrxST2gOU1p4dJwbEZ+vfuRKxiU/7vj5DtiKi8rxuAl/GcFPmMB9RaNX1NlxG5HZazfOVj5S3pXe+KtFlqdbN1caQzcda5ys3JBiaOnenDt187Oir7s2hZyY07q8+GLr52Ja6tn0YcjiJtB11KI2Qg6Xr9MlI72o6RzP6qExOD4ubIxVn1HWw2BxzwqSkI0GO449i8W72gYwLggfZh1IZq2k1lPWs1BofzQ+yaiXOAb+sh+finYtT/5Uh2dvx3lENJUMwPqbWfkzPvc1A3/W4HIz3NhGz4MRWQEGmPVt8nOAw72HKCbOIHiQJo2kOmipmJdGYKdMclG4mPPl8J8WRb+WQ58k+8YhoM9kn1Hu1k5MxmfNnZQrie7dIbCXyYhquqFdztxJgpGO9muS4KDMysQs78ZjoQ8xBp8UQ4rtCeTZeLyuU6Y6Dz+rji2M4498tsykymDcRo291+eTd9PMxW1kw4z1jcSg5Cw2iBCQcGvW82aBqZEa2V7ybfrTcLeM/iapPBiaq4V+JpOmmH3M7uGCp+uZr+Ke7314Fty4tPtTWZs7shddE3d9Q9jT8bXFV60rJTIMGrKYXwtfDSUN2ANzazr7AmDF16ttUUfyf9hdhzrd5F3WCHQAAAABJRU5ErkJggg=="
                  ></image>
                </g>
                <g
                  className="png"
                  transform="matrix(0.800000011920929,0,0,0.800000011920929,60,60)"
                  opacity="1"
                  style={{display: 'block'}}
                >
                  <image
                    width="100px"
                    height="100px"
                    preserveAspectRatio="xMidYMid slice"
                    href="data:image/png;base64,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"
                  ></image>
                </g>
              </g>
            </svg>
          </div>
          <div data-v-647954c7="" className="com__box" style={{display: 'none'}}>
            <div className="loading" data-v-647954c7="">
              <div className="shape shape-1" data-v-647954c7=""></div>
              <div className="shape shape-2" data-v-647954c7=""></div>
              <div className="shape shape-3" data-v-647954c7=""></div>
              <div className="shape shape-4" data-v-647954c7=""></div>
            </div>
          </div>
        </div>
        <div data-v-647954c7="" className="skeleton-wrapper" style={{display: 'none'}}>
          <div data-v-647954c7="" className="van-skeleton van-skeleton--animate">
            <div className="van-skeleton__content">
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '60%'}}></div>
            </div>
          </div>
          <div data-v-647954c7="" className="van-skeleton van-skeleton--animate">
            <div className="van-skeleton-avatar van-skeleton-avatar--round"></div>
            <div className="van-skeleton__content">
              <h3 className="van-skeleton-title"></h3>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '60%'}}></div>
            </div>
          </div>
          <div data-v-647954c7="" className="van-skeleton van-skeleton--animate">
            <div className="van-skeleton__content">
              <h3 className="van-skeleton-title"></h3>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>
      <div
        data-v-19d4c048=""
        className="about-container"
        style={{'--f13b4d11CurrentFontFamily': "'Roboto', 'Inter', 'sansSerif'"}}
      >
        <div data-v-12a80a3e="" data-v-19d4c048="" className="navbar">
          <div data-v-12a80a3e="" className="navbar-fixed">
            <div data-v-12a80a3e="" className="navbar__content">
              <div data-v-12a80a3e="" className="navbar__content-left">
                <i
                  data-v-12a80a3e=""
                  className="van-badge__wrapper van-icon van-icon-arrow-left" onClick={()=>navigate('/main/Abouts')}
                  ></i
                >
              </div>
              <div data-v-12a80a3e="" className="navbar__content-center">
                <div data-v-12a80a3e="" className="navbar__content-title">
                  Confidentiality Agreement
                </div>
              </div>
              <div data-v-12a80a3e="" className="navbar__content-right"></div>
            </div>
          </div>
        </div>
        <div data-v-19d4c048="" className="about-container-content">
          <div className="content" style={{padding: '16px'}}>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                This Privacy Policy describes Our policies and procedures on the
                collection, use and disclosure of Your information when You use
                the Service and tells You about Your privacy rights and how the
                law protects You.
              </p>
            </h3>
            <h1
              style={{
                'boxSizing':' inherit',
                'marginTop': '0px',
                'marginBottom': '0px',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
            }}
            >
              Interpretation and Definitions
            </h1>
            <h2
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Interpretation
            </h2>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                The words of which the initial letter is capitalized have
                meanings defined under the following conditions.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                The following definitions shall have the same meaning regardless
                of whether they appear in singular or in plural.
              </p>
            </h3>
            <h2
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Definitions
            </h2>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                For the purposes of this Privacy Policy:
              </p>
              <ul
                style={{
                  boxSizing: 'inherit',
                  marginRight: '0px',
                  marginBottom: '0px',
                  marginLeft: '0px',
                  backgroundRepeat: 'noRepeat',
                  padding: '0px 0px 0px 24px',
                  'fontSize': '14px',
                  'textAlign': 'start'
            }}
              >
                <li
                  style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <p
                    style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
                  >
                    <span
                       style={{
                        boxSizing: 'inherit',
                        backgroundRepeat: 'noRepeat',
                        padding: '0px',
                        margin:' 0px',
                        fontWeight: 'bolder'
                       }}
                      >You</span
                    >means the individual accessing or using the Service, or the
                    company, or other legal entity on behalf of which such
                    individual is accessing or using the Service, as applicable.
                  </p>
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    <span
                     style={{
                        boxSizing: 'inherit',
                        backgroundRepeat: 'noRepeat',
                        padding: '0px',
                        margin:' 0px',
                        fontWeight: 'bolder'
                       }}
                      >Company</span
                    >(referred to as either "the Company", "We", "Us" or "Our"
                    in this Agreement) refers to BigdadyPro.
                  </p>
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                  style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                
                    
                    >Affiliate</span
                  >means an entity that controls, is controlled by or is under
                  common control with a party, where "control" means ownership
                  of 50% or more of the shares, equity interest or other
                  securities entitled to vote for election of directors or other
                  managing authority.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >Account</span
                  >means a unique account created for You to access our Service
                  or parts of our Service.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >Website</span
                  >refers to<a href="http://localhost:3000//" target="_blank">Bigdady</a
                  >Pro, accessible from <a
                    href="http://localhost:3000/"
                    target="_blank"
                    >http://localhost:3000/</a
                  >
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >Service</span
                  >refers to the Website.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >Country</span
                  >refers to: Uttar Pradesh, India
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    <span
                     style={{
                        boxSizing: 'inherit',
                        backgroundRepeat: 'noRepeat',
                        padding: '0px',
                        margin:' 0px',
                        fontWeight: 'bolder'
                       }}
                      >Service Provider</span
                    >means any natural or legal person who processes the data on
                    behalf of the Company. It refers to third-party companies or
                    individuals employed by the Company to facilitate the
                    Service, to provide the Service on behalf of the Company, to
                    perform services related to the Service or to assist the
                    Company in analyzing how the Service is used.
                  </p>
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >Third-party Social Media Service</span
                  >refers to any website or any social network website through
                  which a User can log in or create an account to use the
                  Service.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    <span
                     style={{
                        boxSizing: 'inherit',
                        backgroundRepeat: 'noRepeat',
                        padding: '0px',
                        margin:' 0px',
                        fontWeight: 'bolder'
                       }}
                      >Personal Data</span
                    >is any information that relates to an identified or
                    identifiable individual.
                  </p>
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >Cookies</span
                  >are small files that are placed on Your computer, mobile
                  device or any other device by a website, containing the
                  details of Your browsing history on that website among its
                  many uses.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >Device</span
                  >means any device that can access the Service such as a
                  computer, a cellphone or a digital tablet.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >Usage Data</span
                  >refers to data collected automatically, either generated by
                  the use of the Service or from the Service infrastructure
                  itself (for example, the duration of a page visit).
                </li>
              </ul>
            </h3>
            <h1
              style={{
                'boxSizing':' inherit',
                'marginTop': '0px',
                'marginBottom': '0px',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
            }}
            >
              Collecting and Using Your Personal Data
            </h1>
            <h2
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Types of Data Collected
            </h2>
            <h3
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Personal Data
            </h3>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                While using Our Service, We may ask You to provide Us with
                certain personally identifiable information that can be used to
                contact or identify You. Personally identifiable information may
                include, but is not limited to:
              </p>
              <ul
                style={{
                  boxSizing: 'inherit',
                  marginRight: '0px',
                  marginBottom: '0px',
                  marginLeft: '0px',
                  backgroundRepeat: 'noRepeat',
                  padding: '0px 0px 0px 24px',
                  'fontSize': '14px',
                  'textAlign': 'start'
            }}
              >
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  Email address
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  First name and last name
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  Phone number
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  Address, State, Province, ZIP/Postal code, City
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  Usage Data
                </li>
              </ul>
            </h3>
            <h3
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Usage Data
            </h3>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                Usage Data is collected automatically when using the Service.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                Usage Data may include information such as Your Device's
                Internet Protocol address (e.g. IP address), browser type,
                browser version, the pages of our Service that You visit, the
                time and date of Your visit, the time spent on those pages,
                unique device identifiers and other diagnostic data.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                When You access the Service by or through a mobile device, We
                may collect certain information automatically, including, but
                not limited to, the type of mobile device You use, Your mobile
                device unique ID, the IP address of Your mobile device, Your
                mobile operating system, the type of mobile Internet browser You
                use, unique device identifiers and other diagnostic data.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                We may also collect information that Your browser sends whenever
                You visit our Service or when You access the Service by or
                through a mobile device.
              </p>
            </h3>
            <h3
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Tracking Technologies and Cookies
            </h3>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                We use Cookies and similar tracking technologies to track the
                activity on Our Service and store certain information. Tracking
                technologies used are beacons, tags, and scripts to collect and
                track information and to improve and analyze Our Service.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                You can instruct Your browser to refuse all Cookies or to
                indicate when a Cookie is being sent. However, if You do not
                accept Cookies, You may not be able to use some parts of our
                Service.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                Cookies can be "Persistent" or "Session" Cookies. Persistent
                Cookies remain on your personal computer or mobile device when
                You go offline, while Session Cookies are de1eted as soon as You
                close your web browser.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                We use both session and persistent Cookies for the purposes set
                out below:
              </p>
              <ul
                style={{
                  boxSizing: 'inherit',
                  marginRight: '0px',
                  marginBottom: '0px',
                  marginLeft: '0px',
                  backgroundRepeat: 'noRepeat',
                  padding: '0px 0px 0px 24px',
                  'fontSize': '14px',
                  'textAlign': 'start'
            }}
              >
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    <span
                     style={{
                        boxSizing: 'inherit',
                        backgroundRepeat: 'noRepeat',
                        padding: '0px',
                        margin:' 0px',
                        fontWeight: 'bolder'
                       }}
                      >Necessary / Essential Cookies</span
                    >
                  </p>
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    Type: Session Cookies
                  </p>
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    Administered by: Us
                  </p>
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    Purpose: These Cookies are essential to provide You with
                    services available through the Website and to enable You to
                    use some of its features. They help to authenticate users
                    and prevent fraudulent use of user accounts. Without these
                    Cookies, the services that You have asked for cannot be
                    provided, and We only use these Cookies to provide You with
                    those services.
                  </p>
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    <span
                     style={{
                        boxSizing: 'inherit',
                        backgroundRepeat: 'noRepeat',
                        padding: '0px',
                        margin:' 0px',
                        fontWeight: 'bolder'
                       }}
                      >Cookies Policy / Notice Acceptance Cookies</span
                    >
                  </p>
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    Type: Persistent Cookies
                  </p>
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    Administered by: Us
                  </p>
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    Purpose: These Cookies identify if users have accepted the
                    use of cookies on the Website.
                  </p>
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    <span
                     style={{
                        boxSizing: 'inherit',
                        backgroundRepeat: 'noRepeat',
                        padding: '0px',
                        margin:' 0px',
                        fontWeight: 'bolder'
                       }}
                      >Functionality Cookies</span
                    >
                  </p>
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    Type: Persistent Cookies
                  </p>
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    Administered by: Us
                  </p>
                  <p
                          style={{
                      boxSizing: 'inherit',
                      marginBottom: '16px',
                      backgroundRepeat: 'noRepeat',
                      padding: '0px'
    }}
         
                  >
                    Purpose: These Cookies allow us to remember choices You make
                    when You use the Website, such as remembering your login
                    details or language preference. The purpose of these Cookies
                    is to provide You with a more personal experience and to
                    avoid You having to re-enter your preferences every time You
                    use the Website.
                  </p>
                </li>
              </ul>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                For more information about the cookies we use and your choices
                regarding cookies, please visit our Cookies Policy.
              </p>
            </h3>
            <h2
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Use of Your Personal Data
            </h2>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                The Company may use Personal Data for the following purposes:
              </p>
              <ul
                style={{
                  boxSizing: 'inherit',
                  marginRight: '0px',
                  marginBottom: '0px',
                  marginLeft: '0px',
                  backgroundRepeat: 'noRepeat',
                  padding: '0px 0px 0px 24px',
                  'fontSize': '14px',
                  'textAlign': 'start'
            }}
              >
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >To provide and maintain our Service</span
                  >, including to monitor the usage of our Service.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >To manage Your Account:</span
                  >to manage Your registration as a user of the Service. The
                  Personal Data You provide can give You access to different
                  functionalities of the Service that are available to You as a
                  registered user.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >For the performance of a contract:</span
                  >the development, compliance and undertaking of the purchase
                  contract for the products, items or services You have
                  purchased or of any other contract with Us through the
                  Service.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >To contact You:</span
                  >To contact You by email, telephone calls, SMS, or other
                  equivalent forms of electronic communication, such as a mobile
                  application's push notifications regarding upda7es or
                  informative communications related to the functionalities,
                  products or contracted services, including the security
                  upda7es, when necessary or reasonable for their
                  implementation.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >To provide You</span
                  >with news, special offers and general information about other
                  goods, services and events which we offer that are similar to
                  those that you have already purchased or enquired about unless
                  You have opted not to receive such information.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >To manage Your requests:</span
                  >To attend and manage Your requests to Us.
                </li>
              </ul>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                We may share your personal information in the following
                situations:
              </p>
              <ul
                style={{
                  boxSizing: 'inherit',
                  marginRight: '0px',
                  marginBottom: '0px',
                  marginLeft: '0px',
                  backgroundRepeat: 'noRepeat',
                  padding: '0px 0px 0px 24px',
                  'fontSize': '14px',
                  'textAlign': 'start'
            }}
              >
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >With Service Providers:</span
                  >We may share Your personal information with Service Providers
                  to monitor and analyze the use of our Service, to contact You.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >For Business transfers:</span
                  >We may share or transfer Your personal information in
                  connection with, or during negotiations of, any merger, sale
                  of Company assets, financing, or acquisition of all or a
                  portion of our business to another company.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >With Affiliates:</span
                  >We may share Your information with Our affiliates, in which
                  case we will require those affiliates to honor this Privacy
                  Policy. Affiliates include Our parent company and any other
                  subsidiaries, joint venture partners or other companies that
                  We control or that are under common control with Us.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >With Business partners:</span
                  >We may share Your information with Our business partners to
                  offer You certain products, services or promotions.
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  <span
                      style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px',
                    fontWeight: 'bolder'
        }}
                    >With other users:</span
                  >when You share personal information or otherwise interact in
                  the public areas with other users, such information may be
                  viewed by all users and may be publicly distributed outside.
                  If You interact with other users or register through a
                  Third-Party Social Media Service, Your contacts on the
                  Third-Party Social Media Service may see You name, profile,
                  pictures and description of Your activity. Similarly, other
                  users will be able to view descriptions of Your activity,
                  communicate with You and view Your profile.
                </li>
              </ul>
            </h3>
            <h2
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Retention of Your Personal Data
            </h2>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                The Company will retain Your Personal Data only for as long as
                is necessary for the purposes set out in this Privacy Policy. We
                will retain and use Your Personal Data to the extent necessary
                to comply with our legal obligations (for example, if we are
                required to retain your data to comply with applicable laws),
                resolve disputes, and enforce our legal agreements and policies.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                The Company will also retain Usage Data for internal analysis
                purposes. Usage Data is generally retained for a shorter period
                of time, except when this data is used to strengthen the
                security or to improve the functionality of Our Service, or We
                are legally obligated to retain this data for longer time
                periods.
              </p>
            </h3>
            <h2
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Transfer of Your Personal Data
            </h2>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                Your information, including Personal Data, is processed at the
                Company's operating offices and in any other places where the
                parties involved in the processing are located. It means that
                this information may be transferred to — and maintained on —
                computers located outside of Your state, province, country or
                other governmental jurisdiction where the data protection laws
                may differ than those from Your jurisdiction.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                Your consent to this Privacy Policy followed by Your submission
                of such information represents Your agreement to that transfer.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                The Company will take all steps reasonably necessary to ensure
                that Your data is treated securely and in accordance with this
                Privacy Policy and no transfer of Your Personal Data will take
                place to an organization or a country unless there are adequate
                controls in place including the security of Your data and other
                personal information.
              </p>
            </h3>
            <h2
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Disclosure of Your Personal Data
            </h2>
            <h3
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Business Transactions
            </h3>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                If the Company is involved in a merger, acquisition or asset
                sale, Your Personal Data may be transferred. We will provide
                notice before Your Personal Data is transferred and becomes
                subject to a different Privacy Policy.
              </p>
            </h3>
            <h3
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Law enforcement
            </h3>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                Under certain circumstances, the Company may be required to
                disclose Your Personal Data if required to do so by law or in
                response to valid requests by public authorities (e.g. a court
                or a government agency).
              </p>
            </h3>
            <h3
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Other legal requirements
            </h3>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                The Company may disclose Your Personal Data in the good faith
                belief that such action is necessary to:
              </p>
              <ul
                style={{
                  boxSizing: 'inherit',
                  marginRight: '0px',
                  marginBottom: '0px',
                  marginLeft: '0px',
                  backgroundRepeat: 'noRepeat',
                  padding: '0px 0px 0px 24px',
                  'fontSize': '14px',
                  'textAlign': 'start'
            }}
              >
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  Comply with a legal obligation
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  Protect and defend the rights or property of the Company
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  Prevent or investigate possible wrongdoing in connection with
                  the Service
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  Protect the personal safety of Users of the Service or the
                  public
                </li>
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  Protect against legal liability
                </li>
              </ul>
            </h3>
            <h2
              style={{ 'boxSizing':' inherit',
                'fontFamily': 'Futura',
              
                margin: '0px',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
              }}
            >
              Security of Your Personal Data
            </h2>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                The security of Your Personal Data is important to Us, but
                remember that no method of transmission over the Internet, or
                method of electronic storage is 100% secure. While We strive to
                use commercially acceptable means to protect Your Personal Data,
                We cannot guarantee its absolute security.
              </p>
            </h3>
            <h1
              style={{
                'boxSizing':' inherit',
                'marginTop': '0px',
                'marginBottom': '0px',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
            }}
            >
              Children's Privacy
            </h1>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                Our Service does not address anyone under the age of 13. We do
                not knowingly collect personally identifiable information from
                anyone under the age of 13. If You are a parent or guardian and
                You are aware that Your child has provided Us with Personal
                Data, please contact Us. If We become aware that We have
                collected Personal Data from anyone under the age of 13 without
                verification of parental consent, We take steps to remove that
                information from Our servers.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                If We need to rely on consent as a legal basis for processing
                Your information and Your country requires consent from a
                parent, We may require Your parent's consent before We collect
                and use that information.
              </p>
            </h3>
            <h1
              style={{
                'boxSizing':' inherit',
                'marginTop': '0px',
                'marginBottom': '0px',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
            }}
            >
              Links to Other Websites
            </h1>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                Our Service may contain links to other websites that are not
                operated by Us. If You click on a third party link, You will be
                directed to that third party's site. We strongly advise You to
                review the Privacy Policy of every site You visit.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                We have no control over and assume no responsibility for the
                content, privacy policies or practices of any third party sites
                or services.
              </p>
            </h3>
            <h1
              style={{
                'boxSizing':' inherit',
                'marginTop': '0px',
                'marginBottom': '0px',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
            }}
            >
              Changes to this Privacy Policy
            </h1>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                We may update our Privacy Policy from time to time. We will
                notify You of any changes by posting the new Privacy Policy on
                this page.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                We will let You know via email and/or a prominent notice on Our
                Service, prior to the change becoming effective and update the
                "Last updated" date at the top of this Privacy Policy.
              </p>
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
            </h3>
            <h1
              style={{
                'boxSizing':' inherit',
                'marginTop': '0px',
                'marginBottom': '0px',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                'backgroundRepeat': 'noRepeat',
                padding: '0px',
                'backgroundColor': 'rgb(250, 250, 250)'
            }}
            >
              Contact Us
            </h1>
            <h3
              className="text-xs-center"
              style={{
                'boxSizing': 'inherit',
                'fontFamily': 'Futura',
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '0px 0px 12px',
               ' backgroundRepeat': 'noRepeat',
                padding: '0px',
                backgroundColor: 'rgb(250, 250, 250)',
                textAlign: 'center !important'
              }}
            >
              <p
                   style={{
                  'boxSizing': 'inherit',
                 ' marginBottom': '16px',
                  'backgroundRepeat': 'noRepeat',
                  padding: '0px',
                  'fontSize': '14px',
                  'textAlign': 'start'
                }}
              >
                If you have any questions about this Privacy Policy, You can
                contact us:
              </p>
              <ul
                style={{
                  boxSizing: 'inherit',
                  marginRight: '0px',
                  marginBottom: '0px',
                  marginLeft: '0px',
                  backgroundRepeat: 'noRepeat',
                  padding: '0px 0px 0px 24px',
                  'fontSize': '14px',
                  'textAlign': 'start'
            }}
              >
                <li
                 style={{
                    boxSizing: 'inherit',
                    backgroundRepeat: 'noRepeat',
                    padding: '0px',
                    margin:' 0px'
        }}
                >
                  By visiting this page on our website:<a
                    href="http://localhost:3000/"
                    target="_blank"
                    >http://localhost:3000/</a
                  >
                </li>
              </ul>
            </h3>
          </div>
        </div>
      </div>
      <div
        className="customer"
        id="customerId"
        style={{
          '--f13b4d11CurrentFontFamily': "'Roboto', 'Inter', 'sansSerif'",
          '--f6a705e1CurrentFontFamily': 'bahnschrift'
        }}
      >
        <img
          className=""
          data-origin="/assets/png/icon_sevice-9f0c8455.png"
          src="/assets/png/icon_sevice-9f0c8455.png"
        />
      </div>
    </div>





    </div>
  )
}