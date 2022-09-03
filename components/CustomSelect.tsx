import {
    chakra,
    forwardRef,
    FormControlOptions,
    HTMLChakraProps,
    omitThemingProps,
    ThemingProps,
    useMultiStyleConfig,
    useFormControl,
    useMergeRefs,
    usePopper,
    extendTheme,
    Badge,
} from '@chakra-ui/react'
import { getColor, mode } from '@chakra-ui/theme-tools'
import { mergeWith } from '@chakra-ui/utils'
import { useSelect } from 'downshift'
import { badgeEnum } from './Portfolio/PositionsTable'
import * as React from 'react'

export const DefaultIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
)
  
export const SelectIcon = (props: React.ComponentProps<'svg'>) => (
    <DefaultIcon
      style={{ width: '1em', height: '1em', color: 'currentColor' }}
      role="presentation"
      focusable={false}
      aria-hidden
      {...props}
    />
)

export interface OptionProps extends HTMLChakraProps<'li'>, ThemingProps {
    value: string
}

export interface SelectProps
  extends FormControlOptions,
    ThemingProps<'Select'>,
    Omit<
      HTMLChakraProps<'button'>,
      'disabled' | 'required' | 'readOnly' | 'size' | 'value' | 'onChange'
    > {
  placeholder?: string
  value?: string | null | undefined
  onChange?: (item: string | null | undefined) => void
}
  
export const Option = forwardRef<OptionProps, 'li'>((props, ref) => {
    const { children, value, ...rest } = omitThemingProps(props)
    const { option } = useMultiStyleConfig('CustomSelect', props)

    return (
      <chakra.li ref={ref} __css={option} {...rest}>
        <Badge variant={'subtle'} fontSize="xs" colorScheme={badgeEnum[value]}>
            {children || value}
        </Badge>
      </chakra.li>
    )
})

// eslint-disable-next-line react/display-name
export const CustomSelect = React.forwardRef<HTMLButtonElement, SelectProps>((props, ownRef) => {
    const { value, children, placeholder, onChange, ...rest } = omitThemingProps(props)
    const ownButtonProps = useFormControl<HTMLButtonElement>(rest)
    const styles = useMultiStyleConfig('CustomSelect', props)
  
    const validChildren = React.useMemo(
      () =>
        React.Children.toArray(children)
          .filter<React.ReactElement<{ value: string }>>(React.isValidElement)
          .filter((child) => 'value' in child.props),
      [children],
    )
  
    const items = validChildren.map((child) => child.props.value)
  
    const { isOpen, selectedItem, getToggleButtonProps, getMenuProps, getItemProps } = useSelect({
      items,
      selectedItem: value,
      onSelectedItemChange: (val) => onChange?.(val.selectedItem),
    })
  
    const { referenceRef: popperRef, getPopperProps } = usePopper({
      enabled: isOpen,
      gutter: 2,
    })
    const { ref: useSelectToggleButtonRef, ...useSelectToggleButtonProps } = getToggleButtonProps()
  
    const toggleButtonRef = useMergeRefs(ownRef, useSelectToggleButtonRef, popperRef)
    const toggleButtonProps = mergeWith(ownButtonProps, useSelectToggleButtonProps)
  
    return (
        <chakra.div position="relative">
            <chakra.button ref={toggleButtonRef} __css={styles.field} {...toggleButtonProps}>
                <chakra.span>{selectedItem || placeholder}</chakra.span>
                <SelectIcon />
            </chakra.button>

            <chakra.div
                zIndex="1"
                {...mergeWith(getPopperProps(), {
                    style: { visibility: isOpen ? 'visible' : 'hidden' },
                })}
            >
                <chakra.ul __css={styles.menu} {...getMenuProps()}>
                    {isOpen &&
                    validChildren.map((item, index) =>
                        React.cloneElement(item, {
                        ...getItemProps({ item: item.props.value, index }),
                        }),
                    )}
                </chakra.ul>
            </chakra.div>
        </chakra.div>
    )
})
