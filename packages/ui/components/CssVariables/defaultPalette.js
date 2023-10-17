// refs:
// https://accessiblepalette.com/?lightness=98,93.3,88.6,79.9,71.2,60.5,49.8,38.4,27,15.6&e94c49=1,0&F1903C=1,-10&f3e203=1,-15&89BF1D=0,0&64c273=0,15&007DCC=0,0&808080=0,0&EAE8DE=0,0&768092=0,0
// https://www.ibm.com/design/language/color/

const P = {} // palette. Each color has 12 levels and has to start with black and end with white
/* eslint-disable no-multi-spaces */
P.red       = ['#000000', '#2d0709', '#520408', '#750e13', '#a2191f', '#da1e28', '#fa4d56', '#ff8389', '#ffb3b8', '#ffd7d9', '#fff1f1', '#ffffff']
P.magenta   = ['#000000', '#2a0a18', '#510224', '#740937', '#9f1853', '#d02670', '#ee5396', '#ff7eb6', '#ffafd2', '#ffd6e8', '#fff0f7', '#ffffff']
P.purple    = ['#000000', '#1c0f30', '#31135e', '#491d8b', '#6929c4', '#8a3ffc', '#a56eff', '#be95ff', '#d4bbff', '#e8daff', '#f6f2ff', '#ffffff']
P.blue      = ['#000000', '#001141', '#001d6c', '#002d9c', '#0043ce', '#0f62fe', '#4589ff', '#78a9ff', '#a6c8ff', '#d0e2ff', '#edf5ff', '#ffffff']
P.cyan      = ['#000000', '#061727', '#012749', '#003a6d', '#00539a', '#0072c3', '#1192e8', '#33b1ff', '#82cfff', '#bae6ff', '#e5f6ff', '#ffffff']
P.teal      = ['#000000', '#081a1c', '#022b30', '#004144', '#005d5d', '#007d79', '#009d9a', '#08bdba', '#3ddbd9', '#9ef0f0', '#d9fbfb', '#ffffff']
P.green     = ['#000000', '#071908', '#022d0d', '#044317', '#0e6027', '#198038', '#24a148', '#42be65', '#6fdc8c', '#a7f0ba', '#defbe6', '#ffffff']
P.orange    = ['#000000', '#030100', '#43100b', '#6d120f', '#872a0f', '#a53725', '#d74108', '#ff5003', '#ff7832', '#ffa573', '#ffd4a0', '#ffffff']
P.yellow    = ['#000000', '#020100', '#281e00', '#3c3200', '#574a00', '#735f00', '#8c7300', '#be9b00', '#efc100', '#fdd600', '#fde876', '#ffffff']
P.coolGray  = ['#000000', '#121619', '#21272a', '#343a3f', '#4d5358', '#697077', '#878d96', '#a2a9b0', '#c1c7cd', '#dde1e6', '#f2f4f8', '#ffffff']
P.gray      = ['#000000', '#161616', '#262626', '#393939', '#525252', '#6f6f6f', '#8d8d8d', '#a8a8a8', '#c6c6c6', '#e0e0e0', '#f4f4f4', '#ffffff']
P.warmGray  = ['#000000', '#171414', '#272525', '#3c3838', '#565151', '#726e6e', '#8f8b8b', '#ada8a8', '#cac5c4', '#e5e0df', '#f7f3f2', '#ffffff']
/* eslint-enable no-multi-spaces */
export default P

export const skipLowest = 2 // black and almost black
export const skipHighest = 1 // white
