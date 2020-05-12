export default function pipeComponentMeta (
  SourceComponent,
  TargetComponent,
  suffix = '',
  defaultName = 'StartupjsWrapper'
) {
  const displayName = SourceComponent.displayName || SourceComponent.name
  if (!TargetComponent.displayName) {
    TargetComponent.displayName = displayName ? (displayName + suffix) : defaultName
  }
  if (!TargetComponent.propTypes && SourceComponent.propTypes) {
    TargetComponent.propTypes = SourceComponent.propTypes
  }
  if (!TargetComponent.defaultProps && SourceComponent.defaultProps) {
    TargetComponent.defaultProps = SourceComponent.defaultProps
  }
  return TargetComponent
}
