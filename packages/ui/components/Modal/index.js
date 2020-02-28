import { observer } from 'startupjs'
import { View } from 'react-native'
import propTypes from 'prop-types'
import Modal from './modal'
import Actions from './actions'

Modal.defaultProps = {
  visible: false,
  ModalElement: View
}

Modal.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  visible: propTypes.bool,
  title: propTypes.string,
  ModalElement: propTypes.func,
  onShow: propTypes.func,
  onDismiss: propTypes.func,
  onBackdropPress: propTypes.func
}

const ObservedModal = observer(Modal)
ObservedModal.Actions = Actions

export default ObservedModal
