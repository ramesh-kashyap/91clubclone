import React, { useState } from 'react';

export default function ConfirmDeposit() {


  return (
  
<div className="" style={{fontSize: '12px'}}> 

    <div id="app" data-v-app="">
        <div data-v-647954c7="" className="ar-loading-view"
            style={{
              '--f13b4d11CurrentFontFamily': "'Roboto', 'Inter', 'sansSerif'",
              display: 'none'
            }}>
            <div data-v-647954c7="" className="loading-wrapper">
                <div data-v-647954c7="" className="loading-animat"><svg xmlns="http://www.w3.org/2000/svg"
                        xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="200" height="200"
                        preserveAspectRatio="xMidYMid meet"
                        style={{
                          width: '100%',
                          height: '100%',
                          transform: 'translate3d(0px, 0px, 0px)',
                          contentVisibility: 'visible'
                        }}>
                        <defs>
                            <clipPath id="__lottie_element_2">
                                <rect width="200" height="200" x="0" y="0"></rect>
                            </clipPath>
                            <image
                                href="data:image/png;base64,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">
                            </image>
                            <image
                                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAHlBMVEVHcEy/GyDCGiHCGiDBGiHBGiLBGiG/GyC/HCDBGiEYgX5lAAAACXRSTlMAFupex4emMEAHMN8rAAAEw0lEQVR42u1cy1ITQRTtYTKZsAsQLLODUsDeoVWC2YGSSHYC8ZEdolU6Owopq9gpisJOhwS5f2vPDENek2QefW5ZyF0BReZM9z3nPjrdLURimxJwM+p0Dw5SIqJl9ECaCmQO93z7pLFBvv1BjeDkPV3bJQbicZ267DcC4ySAcGsvT3+W1Q+7+iHMPR+huhr8RtQqasf4IRVEa+f6wbM17Qw2tr1RvCsiZVFwFMbCPlR6pvK4+xorb1O542IZj7FQxGIUFAY64Np1PIYXbuGJ4xEDhspNbbDPPWK10BiGQy46x4pjoi00hsXgdFX1XKAdIg7wRY/HrCV4+VbBs1fkIYVCnzl0LvADwctQ0Rfv9RK5+wweWWfwCJ6+aiDzcAyLwyMVBmrZHAOZZhC7EuIyA38vBIPb8UK0pYsXYonB7aJJL+AYBWoJBpEsccwWXiQ2x2zlMCsm/UrEc8uQLn4gFmgRq8fKtIYHcQgftwyOKJ/nIHCZgcDCcW+ISywOl0wzNFcqcOGLOlFnCPM2RwmRR35ZEdoEhxRZ/O4wJCyDw+8mh97zHFmRhVxHHORqMpBL1BmSieBgcIGDwRZHeMxzpEUWmZTpCx7kjKEM5tGi0+IQfJsBRDIIXnA0cjZsX0UPyC+O+MgAYnJk+JsDYnFEeosj0t+CxLXDIh7EkGt4kCCg3IL8SyCmX5+CY5flP/4mgUCL+pwf5ME5Pufzysb2QBPBNybYumsy6BmwLWM56N+xtfAZBVU9tMO+akya0NbhqjGpEENjcgTtGa9oNYn87i/sGXLI6s68iicWMkKGC3bQtZVwJQK6zlkOHY6UfCVciUCuFlwvElSA6x6y3T9vCJlcXtMMJpTOgh1whbsjdOB3NF2ewK3ZNjucwtFLXkQNSje5zruiGKi+636wiaqKprs7BgnyfI+zmyDPy1YPnSGNUKFHgHnM9sdcD6EKGM2f9U5QHZJS+vYrVBByNKjdl+/nEFKc7yuPzuEu8ZyiXykDzzzTrxST2gOU1p4dJwbEZ+vfuRKxiU/7vj5DtiKi8rxuAl/GcFPmMB9RaNX1NlxG5HZazfOVj5S3pXe+KtFlqdbN1caQzcda5ys3JBiaOnenDt187Oir7s2hZyY07q8+GLr52Ja6tn0YcjiJtB11KI2Qg6Xr9MlI72o6RzP6qExOD4ubIxVn1HWw2BxzwqSkI0GO449i8W72gYwLggfZh1IZq2k1lPWs1BofzQ+yaiXOAb+sh+finYtT/5Uh2dvx3lENJUMwPqbWfkzPvc1A3/W4HIz3NhGz4MRWQEGmPVt8nOAw72HKCbOIHiQJo2kOmipmJdGYKdMclG4mPPl8J8WRb+WQ58k+8YhoM9kn1Hu1k5MxmfNnZQrie7dIbCXyYhquqFdztxJgpGO9muS4KDMysQs78ZjoQ8xBp8UQ4rtCeTZeLyuU6Y6Dz+rji2M4498tsykymDcRo291+eTd9PMxW1kw4z1jcSg5Cw2iBCQcGvW82aBqZEa2V7ybfrTcLeM/iapPBiaq4V+JpOmmH3M7uGCp+uZr+Ke7314Fty4tPtTWZs7shddE3d9Q9jT8bXFV60rJTIMGrKYXwtfDSUN2ANzazr7AmDF16ttUUfyf9hdhzrd5F3WCHQAAAABJRU5ErkJggg==">
                            </image>
                        </defs>
                        <g clip-path="url(#__lottie_element_2)">
                            <g className="ai"
                                transform="matrix(0.3730732798576355,-0.9278019070625305,0.9278019070625305,0.3730732798576355,-30.087509155273438,155.4728546142578)"
                                opacity="1" style={{display: 'block'}}>
                                <image width="200px" height="200px" preserveAspectRatio="xMidYMid slice"
                                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAHlBMVEVHcEy/GyDCGiHCGiDBGiHBGiLBGiG/GyC/HCDBGiEYgX5lAAAACXRSTlMAFupex4emMEAHMN8rAAAEw0lEQVR42u1cy1ITQRTtYTKZsAsQLLODUsDeoVWC2YGSSHYC8ZEdolU6Owopq9gpisJOhwS5f2vPDENek2QefW5ZyF0BReZM9z3nPjrdLURimxJwM+p0Dw5SIqJl9ECaCmQO93z7pLFBvv1BjeDkPV3bJQbicZ267DcC4ySAcGsvT3+W1Q+7+iHMPR+huhr8RtQqasf4IRVEa+f6wbM17Qw2tr1RvCsiZVFwFMbCPlR6pvK4+xorb1O542IZj7FQxGIUFAY64Np1PIYXbuGJ4xEDhspNbbDPPWK10BiGQy46x4pjoi00hsXgdFX1XKAdIg7wRY/HrCV4+VbBs1fkIYVCnzl0LvADwctQ0Rfv9RK5+wweWWfwCJ6+aiDzcAyLwyMVBmrZHAOZZhC7EuIyA38vBIPb8UK0pYsXYonB7aJJL+AYBWoJBpEsccwWXiQ2x2zlMCsm/UrEc8uQLn4gFmgRq8fKtIYHcQgftwyOKJ/nIHCZgcDCcW+ISywOl0wzNFcqcOGLOlFnCPM2RwmRR35ZEdoEhxRZ/O4wJCyDw+8mh97zHFmRhVxHHORqMpBL1BmSieBgcIGDwRZHeMxzpEUWmZTpCx7kjKEM5tGi0+IQfJsBRDIIXnA0cjZsX0UPyC+O+MgAYnJk+JsDYnFEeosj0t+CxLXDIh7EkGt4kCCg3IL8SyCmX5+CY5flP/4mgUCL+pwf5ME5Pufzysb2QBPBNybYumsy6BmwLWM56N+xtfAZBVU9tMO+akya0NbhqjGpEENjcgTtGa9oNYn87i/sGXLI6s68iicWMkKGC3bQtZVwJQK6zlkOHY6UfCVciUCuFlwvElSA6x6y3T9vCJlcXtMMJpTOgh1whbsjdOB3NF2ewK3ZNjucwtFLXkQNSje5zruiGKi+636wiaqKprs7BgnyfI+zmyDPy1YPnSGNUKFHgHnM9sdcD6EKGM2f9U5QHZJS+vYrVBByNKjdl+/nEFKc7yuPzuEu8ZyiXykDzzzTrxST2gOU1p4dJwbEZ+vfuRKxiU/7vj5DtiKi8rxuAl/GcFPmMB9RaNX1NlxG5HZazfOVj5S3pXe+KtFlqdbN1caQzcda5ys3JBiaOnenDt187Oir7s2hZyY07q8+GLr52Ja6tn0YcjiJtB11KI2Qg6Xr9MlI72o6RzP6qExOD4ubIxVn1HWw2BxzwqSkI0GO449i8W72gYwLggfZh1IZq2k1lPWs1BofzQ+yaiXOAb+sh+finYtT/5Uh2dvx3lENJUMwPqbWfkzPvc1A3/W4HIz3NhGz4MRWQEGmPVt8nOAw72HKCbOIHiQJo2kOmipmJdGYKdMclG4mPPl8J8WRb+WQ58k+8YhoM9kn1Hu1k5MxmfNnZQrie7dIbCXyYhquqFdztxJgpGO9muS4KDMysQs78ZjoQ8xBp8UQ4rtCeTZeLyuU6Y6Dz+rji2M4498tsykymDcRo291+eTd9PMxW1kw4z1jcSg5Cw2iBCQcGvW82aBqZEa2V7ybfrTcLeM/iapPBiaq4V+JpOmmH3M7uGCp+uZr+Ke7314Fty4tPtTWZs7shddE3d9Q9jT8bXFV60rJTIMGrKYXwtfDSUN2ANzazr7AmDF16ttUUfyf9hdhzrd5F3WCHQAAAABJRU5ErkJggg==">
                                </image>
                            </g>
                            <g className="png"
                                transform="matrix(0.87566077709198,0,0,0.87566077709198,56.21696090698242,56.21696090698242)"
                                opacity="1" style={{display: 'block'}}>
                                <image width="100px" height="100px" preserveAspectRatio="xMidYMid slice"
                                    href="data:image/png;base64,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">
                                </image>
                            </g>
                        </g>
                    </svg></div>
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
        <div data-v-003e4505="" id="home" className="red-home content"
            style={{'--f13b4d11CurrentFontFamily': "'Roboto', 'Inter', 'sansSerif'"}}>
            <div data-v-12a80a3e="" data-v-003e4505="" className="navbar white">
                <div data-v-12a80a3e="" className="navbar-fixed">
                    <div data-v-12a80a3e="" className="navbar__content">
                        <div data-v-12a80a3e="" className="navbar__content-left"><img data-v-003e4505=""
                                src="/assets/png/h5setting_20230714005937kuk1.png"
                                alt=""/></div>
                        <div data-v-12a80a3e="" className="navbar__content-center">
                            <div data-v-12a80a3e="" className="navbar__content-title"></div>
                        </div>
                      
                    </div>
                </div>

                
            </div>
            
            <div className="container11">
          
              <div  className="" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  
                    <div data-v-67e25db3="" className="maindiv" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px',  borderRadius: '10px', width: '100%', margin: '0 auto', backgroundColor: '#f9f9f9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',}}>
                        <div data-v-67e25db3="" className="sec1" style={{margin: '10px 0', textAlign: 'center'}}>
                            <div data-v-67e25db3="" className="ti1" style={{fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px', color: '#333',}}>CountDown</div>
                            <div data-v-67e25db3="" className="time" style={{fontSize: '2em', color: '#ff0000'}}>119:32</div>
                        </div>
                        <div data-v-67e25db3="" className="sec2" style={{margin: '10px 0', textAlign: 'center'}}>
                            <div data-v-67e25db3="" className="ti2" style={{fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px', color: '#333',}}>Order Number</div>
                            <div data-v-67e25db3="" className="num2" style={{fontSize: '1.2em', color: '#555', display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                                P2024090609590109021 
                                <svg data-v-67e25db3="" className="c5" xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none" style={{marginLeft: '10px'}}>
                                    <rect data-v-67e25db3="" x="1" y="3" width="8" height="9" rx="1" stroke="black"></rect>
                                    <path data-v-67e25db3="" d="M9.5 10H10C10.5523 10 11 9.55228 11 9V2C11 1.44772 10.5523 1 10 1H4C3.44772 1 3 1.44772 3 2V3" stroke="black"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                  
                  
                  <div data-v-67e25db3="" className="codeqr" style={{
                    display: 'flex',
                    justifyContent: 'center',
                   alignItems: 'center',
                   textAlign: 'center',
                    margin: '20px 0',
                  }}>
                    <div data-v-67e25db3="" className="imgqr" style={{
                    width: '150px',
                    height: '150px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',}}>
                      <img
                        data-v-67e25db3=""
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAXNSR0IArs4c6QAACFRJREFUeF7tnduO6zgMBJP//+hZYN/kHLhQaMpxkp5XyhTVLFKKcpnn39/f36N/VWBIgWeBGlKybv5XoEAVhFEFCtSonHVWoMrAqAIFalTOOitQZWBUgQI1KmedFagyMKpAgRqVs84KVBkYVaBAjcpZZwWqDIwqUKBG5ayzAlUGRhUoUKNy1lkM1PP5vFRF+/GtY3z0/N3H7xab9KH5C9RBoQKVfd6yQBWoRYF2KOjBd+84lMC7HymO8o93KBKI9uCXAA9ntGn/NB/Fm8ZDwJOd4iP7tP8CBVseJaRArQoVqAJ17zNUWrG0BU37p/naoUiBizuUPVQegbF7PI1P7VcDaOOl9Kf6kv/tW16BWlNgO2yBOnwRuUAVKOpqi/1uFWTjSbeAtGBIbLse8peul/z//JZHApGdEmSfpzPa9HwELMV/+cVmWsF2wTTexkOCTie4QMFNtk0gJYgOtQXqvARSfanAuuWRQmCnBJH7qwuE4qV4aD1fDxQJQAIfn6fx1k7xTXfc6fh+7gxFCSOBCxQp+GM35SRHgVo/cdst70DM9IuAdigqyYs7lAvndbQ9Q0x3HAKK1jcNeNpB7LUEre/yM5QNyC7YAkeAEAA2oeTPxmPnJ/1JP3q+QB0USDsaCV6gSCE4s1xdQVRhlNACdfNDueRRDycAvt2uBZMPpA1h/GJTxq+HfzswtD4tmHygQMn3Eilhd7dLPvTwAlWgNDRnD7wdqNHVvMGZPdST4NYfXRu8QZJoyvgMFc1+g4ctAAXqPGkFKtwy04vYdqgbdJXJENqhJtUc+G9UlJDdFWwvLlP5ds9HepI9XV/6fLzl2QXSeJswOz4WDH5gjc5YNL/VJ52P4rH2AiUV2w1wgZI/t2MFo0Pr7gTTlk3xSV4fVp+v71BWwPRmmuYj/wSEBXZ6PMWXAk8Ak74v86f/c5gEpIAo4WRP/VPCaH02Pjue4itQBwVIYLIXqFWBtADSLXT8UE4JpoqjFkyCWf93H0/x/XyHogogYHZ3LIrPFsz0emj91m7XQ+Mv71CUsOkEUIVTRyQByT69HgvM7vW9/VBeoNYUECBpQRQoeRNNHSBNCHUgslN8BeqgIAlGCaVDJXU0m1BKINlpvjRe8m87Do0nO8XzcVtemiASzNpJ4DRe8k/x2gK1/jC+qy82SfDxBYafd5ruwJQQslt9aDzZKZ52KPhR2W55b/5vVLbF2vHUIQgA6oi6AuWLBvJP67Nn0HS+VK/4HsoCYseT4AWKEFrtVk/nfeATmxYQO94KMH0moHjTDkLrS/3vjn/8DEUBUwslAEjwdijXQ6yezvtAhyIgUuBoQen8tgPQfGS3elh/V/sf71B2wXZ8gcp+HYX0JjvpX6DCV2mUALJf3UEoHrIXqMM9EyWwW17WAbd3KEqQPRTaCtrtnyrWxpsCT/ORHpQvWm+BkjflWlD5LaACdVCAKoBe1lOFUAXuTkiBcgrEN+UFahXcFsDugqD8UEE7nAbuoeyE6fg0YTaBFK/twJRAAsDOl46n9Y+foeyE6fgCtX4aYDeANl/xlmcnTMcXqAKVMrQ8X6B+DKh3J5zODPbNaqoG8kfP05mO/E/rbePdfoaaXiCdEewh1yaIBCZ/9HyBAoUKlEUou3aY1juLfsO1wfQC26HOP+M9rffHAUUCWDtteemWQgJTvPQ82amg0jMjzW/t49cGJPC0vUCdv+qbPuMRYAUKPu6CAoZvBlv/VEBUsDRfai9QBSplaL0nnP7mMO3ptsJotbalUwWTneKxdjojkV40327/4/dQlABakAVwWmCa3wJLCaYXCfS8jYf0T/UsUOFvHVDCrX13wnf7L1AF6pR52wHHgaKKnN4S0y2DWjzFm67Xxm8TTPFTx7LzFaiDAtNnKEpogaKSBDsJnFYMPU/hF6hVoXYo+OJmgco+P0X6jW950x0o7ThWAKrINJ7d/ulMuHuLLVBwhrIJIIALFCl0sLdDnQtWoArUokC3PAfE+JvDbvp8dJpwiuBuHcZuyRQ/rd/aCxQoRgmZBprmK1AWcTl+OqHTr5rkch4Fyio2PL5Arb/vZAtiOB2PeMvbnVArkI2Hbspp/vRV7m7/tD7bEQnAAgW/F7U74bv9F6iLD8kk+O6E7/ZP62uHCn9D0ybQjqcE0pZBz5M9jZfiI/v4ljdO/OYPxNGZixKYrpfOYJhAqQ/5i9ez+0sKtACyk+Bkt/6vrvDp+KkASI8CFX4vrh1qRaxAFaiFiK/vUNQBprcYmo8Et/Zj/On8tCWl9nR9NP/2QzkJXKDOb7opgdZeoOSWRgBbQe2hOZ3fAmLH2/Vb/+1Q8mU3HVoLFCkEiFIFk8Dplkfz2zMOVSTJReul5yle6jCpnrR+sn98hypQ7tMGVi8C6KUAdl9sUsWmFWUFsvFQfNRR7PPkrx1Kfm+OBLN2SpCtQNqyCFh6nuKl9RPAtgCtPh+/5U0ngAS0QJA/SjABSv4pXpqf/H/dllegzlNeoMJ/kEgVt7vidUXLawvrv0AVqIWZ3QVABWgB3n6GsgHZLYz8X50QOhRTvKmdACF7PP/ua4M4QPnWCwFp47FbRoEixSAD24kvUKoGKB9kV5P9Y3C3PFCQ6o22VHo+TSB1ZLq3mo5vHKhpgWgLoYp7t530sEDa8RY4ipfsBUq+bJ+ueAuIHV+g5Bb07g5E82NFw1tTBDB18AJVoBYFfg4oqsDaf0uB+Az1W3J1taRAgSKFalcKFCglVweTAgWKFKpdKVCglFwdTAoUKFKodqVAgVJydTApUKBIodqVAgVKydXBpECBIoVqVwoUKCVXB5MCBYoUql0pUKCUXB1MChQoUqh2pUCBUnJ1MCnwH0VPqvk55Ga0AAAAAElFTkSuQmCC"
                        alt="QR Code"
                        id="canvasDom"
                      />
                    </div>
                  </div>
          
                 

                  <div data-v-67e25db3="" className="item">
                    <div data-v-67e25db3="" className="head">
                        <span data-v-67e25db3="" className="name">Network</span>
                    </div>
                    <div data-v-67e25db3="" className="head">
                        <span data-v-67e25db3="" className="name">USD-789</span>
                    </div>
                        
                   
                  
                        <div data-v-67e25db3="" className="head" >
                            <span data-v-67e25db3="" className="name">Wallet Address</span>
                        </div>
                        <div data-v-5bd44e74="" className="userInfo__container-setting-center-content"><h5 data-v-5bd44e74="">TRW9j8BU56MdmVvEXDxGfarDpEDP6WqoiL</h5><div data-v-5bd44e74=""><span data-v-5bd44e74=""></span><svg data-v-5bd44e74="" className="svg-icon icon-copy"><use href="#icon-copy"></use></svg></div></div>
                    </div>
                </div>


                  <div data-v-7cba6004="" data-v-36cc3380="" className="Recharge__container-intro">
                    <div data-v-30972a14="" className="rechargeh__container-head"><h1 data-v-30972a14="">Warning:</h1></div>
                    <div data-v-7cba6004="" className="Recharge__container-intro__lists">
                      <div data-v-7cba6004="" className="item">
                        <p data-v-7cba6004="">
                          If the transfer time is up, please fill out the deposit form
                          again.
                        </p>
                        <p data-v-7cba6004="">
                          The transfer amount must match the order you created,
                          otherwise the money cannot be credited successfully.
                        </p>
                        <p data-v-7cba6004="">
                          If you transfer the wrong amount, our company will not be
                          responsible for the lost amount!
                        </p>
                        
                        <p data-v-7cba6004="">
                          Note: do not cancel the deposit order after the money has been
                          transferred.
                        </p>
                      </div>
                      
                    </div>
                  </div>
                </div>
                
              </div>
  </div>
</div>

  )
}