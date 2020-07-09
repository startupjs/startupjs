import { observer } from 'startupjs'
import { View } from 'react-native'
import propTypes from 'prop-types'
import Modal from './modal'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions from './ModalActions'

Modal.defaultProps = {
  visible: false,
  variant: 'window',
  dismissLabel: ModalActions.defaultProps.dismissLabel,
  confirmLabel: ModalActions.defaultProps.confirmLabel,
  ModalElement: View
}

Modal.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf(['window', 'fullscreen', 'pure']),
  visible: propTypes.bool,
  title: propTypes.string,
  dismissLabel: ModalActions.propTypes.dismissLabel,
  confirmLabel: ModalActions.propTypes.confirmLabel,
  ModalElement: propTypes.func,
  onShow: propTypes.func,
  onCrossPress: propTypes.func,
  onDismiss: propTypes.func,
  onConfirm: propTypes.func,
  onBackdropPress: propTypes.func
}

const ObservedModal = observer(Modal)
ObservedModal.Header = ModalHeader
ObservedModal.Content = ModalContent
ObservedModal.Actions = ModalActions

export default ObservedModal
