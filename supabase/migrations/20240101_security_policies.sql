-- Companies Policies
CREATE POLICY "Users can view companies they belong to"
    ON public.companies FOR SELECT
    USING (
        id IN (
            SELECT company_id 
            FROM public.integrations 
            WHERE user_id = auth.uid()
        )
    );

-- Integrations Policies
CREATE POLICY "Users can view their own integrations"
    ON public.integrations FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own integrations"
    ON public.integrations FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own integrations"
    ON public.integrations FOR DELETE
    USING (user_id = auth.uid());

-- Products Policies
CREATE POLICY "Users can view products from their companies"
    ON public.products FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.integrations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can modify products from their companies"
    ON public.products FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.integrations 
            WHERE user_id = auth.uid()
        )
    );

-- Product Categories Policies
CREATE POLICY "Users can view categories from their companies"
    ON public.product_categories FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.integrations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can modify categories from their companies"
    ON public.product_categories FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.integrations 
            WHERE user_id = auth.uid()
        )
    );

-- Product Variations Policies
CREATE POLICY "Users can view variations of accessible products"
    ON public.product_variations FOR SELECT
    USING (
        product_id IN (
            SELECT id 
            FROM public.products 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.integrations 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can modify variations of accessible products"
    ON public.product_variations FOR ALL
    USING (
        product_id IN (
            SELECT id 
            FROM public.products 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.integrations 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Orders Policies
CREATE POLICY "Users can view orders from their companies"
    ON public.orders FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.integrations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can modify orders from their companies"
    ON public.orders FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.integrations 
            WHERE user_id = auth.uid()
        )
    );

-- Order Items Policies
CREATE POLICY "Users can view items from accessible orders"
    ON public.order_items FOR SELECT
    USING (
        order_id IN (
            SELECT id 
            FROM public.orders 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.integrations 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can modify items from accessible orders"
    ON public.order_items FOR ALL
    USING (
        order_id IN (
            SELECT id 
            FROM public.orders 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.integrations 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Order History Policies
CREATE POLICY "Users can view history of accessible orders"
    ON public.order_history FOR SELECT
    USING (
        order_id IN (
            SELECT id 
            FROM public.orders 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.integrations 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can add history to accessible orders"
    ON public.order_history FOR INSERT
    WITH CHECK (
        order_id IN (
            SELECT id 
            FROM public.orders 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.integrations 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Integration Mappings Policies
CREATE POLICY "Users can view mappings from their integrations"
    ON public.integration_mappings FOR SELECT
    USING (
        integration_id IN (
            SELECT id 
            FROM public.integrations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can modify mappings from their integrations"
    ON public.integration_mappings FOR ALL
    USING (
        integration_id IN (
            SELECT id 
            FROM public.integrations 
            WHERE user_id = auth.uid()
        )
    );

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can mark their own notifications as read"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

-- Audit Log Policies
CREATE POLICY "Users can view audit logs from their companies"
    ON public.audit_log FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.integrations 
            WHERE user_id = auth.uid()
        )
    );

-- Function to automatically add audit log entries
CREATE OR REPLACE FUNCTION public.handle_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_log (
        action,
        entity_type,
        entity_id,
        old_data,
        new_data,
        user_id,
        company_id
    ) VALUES (
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        auth.uid(),
        COALESCE(NEW.company_id, OLD.company_id)
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to relevant tables
CREATE TRIGGER handle_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_audit_log();

CREATE TRIGGER handle_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_audit_log();

CREATE TRIGGER handle_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.integrations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_audit_log(); 