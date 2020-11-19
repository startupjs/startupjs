import { View } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  variant: PropTypes.oneOf(['window', 'fullscreen', 'pure']),
  visible: PropTypes.bool,
  title: PropTypes.string,
  dismissLabel: ModalActions.propTypes.dismissLabel,
  confirmLabel: ModalActions.propTypes.confirmLabel,
  ModalElement: PropTypes.any,
  onShow: PropTypes.func,
  onCrossPress: PropTypes.func,
  onDismiss: PropTypes.func,
  onConfirm: PropTypes.func,
  onBackdropPress: PropTypes.func
}

const ObservedModal = observer(Modal)
ObservedModal.Header = ModalHeader
ObservedModal.Content = ModalContent
ObservedModal.Actions = ModalActions

export default ObservedModal
